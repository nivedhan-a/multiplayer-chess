import { useState, useEffect } from 'react';
import './App.css';
import { gameSubject, initGame, resetGame } from './Game';
import Board from './Board';
import { useParams, useHistory } from 'react-router-dom';
import { db } from './firebase';

function GameApp() {
  const [board, setBoard] = useState([]);
  const [isGameOver, setIsGameOver] = useState();
  const [result, setResult] = useState();
  const [position, setPosition] = useState();
  const [initResult, setInitResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [game, setGame] = useState({});
  const { id } = useParams();
  const history = useHistory();
  const sharableLink = window.location.href;

  useEffect(() => {
    let subscribe;
    async function init() {
      const res = await initGame(id !== 'local' ? db.doc(`games/${id}`) : null);
      setInitResult(res);
      setLoading(false);
      if (!res) {
        subscribe = gameSubject.subscribe((game) => {
          setBoard(game.board);
          setIsGameOver(game.isGameOver);
          setResult(game.result);
          setPosition(game.position);
          setStatus(game.status);
          setGame(game);
        });
      }
    }
    init();
    return () => subscribe && subscribe.unsubscribe();
  }, [id]);

  async function copyToClipboard() {
    await navigator.clipboard.writeText(sharableLink);
  }

  if (loading) {
    return 'Loading...';
  }
  if (initResult === 'notfound') {
    return 'Game Not Found';
  }
  if (initResult === 'intruder') {
    return 'The game is already full';
  }

  return (
    <div className="app-container">
      {isGameOver && (
        <h2 className="vertical-text">
          GAME OVER
          <button
            onClick={async () => {
              await resetGame();
              history.push('/');
            }}
          >
            <span className="vertical-text">NEW GAME</span>
          </button>
        </h2>
      )}
      <div className="board-container">
        {game.opponent && game.opponent.name && <span className="bg-white p-2 rounded font-bold">{game.opponent.name}</span>}
        <Board board={board} position={position} />
        {game.member && game.member.name && <span className="bg-white p-2 rounded font-bold">{game.member.name}</span>}
      </div>
      {result && <p className="vertical-text">{result}</p>}
      {status === 'waiting' && (
        <div className="fixed left-0 bottom-0 m-4 bg-gray-500 p-4 rounded-lg w-80">
          <strong className="text-black">Share this game to continue</strong>
          <div className="flex space-x-4 items-center mt-5">
            <input
              type="text"
              name=""
              id=""
              className="w-full p-2 border border-gray-300 rounded"
              readOnly
              value={sharableLink}
            />
            <button className="bg-black text-white font-bold py-2 px-4 rounded" onClick={copyToClipboard}>
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameApp;
