import { useState } from "react";
import { auth, db } from './firebase';
import { useHistory } from 'react-router-dom';

export default function Home() {

    const { currentUser } = auth;
    const [showModal, setShowModal] = useState(false);
    const history = useHistory();

    const newGameOptions = [
        { label: "Black pieces", value: "b" },
        { label: "White pieces", value: "w" },
        { label: "Random", value: "r" },
    ];

    function handlePlayOnline() {
        setShowModal(true);
    }

    function startLocalGame() {
        history.push('/game/local')
    }

    async function startOnlineGame(startingPiece) {
        const member = {
            uid: currentUser.uid,
            piece: startingPiece === "r" ? ['b', 'w'][Math.round(Math.random())] : startingPiece,
            name: localStorage.getItem('userName'),
            creator: true
        };

        const game = {
            status: 'waiting',
            members: [member],
            gameId: `${Math.random().toString(36).substr(2, 9)}_${Date.now()}`
        };

        await db.collection('games').doc(game.gameId).set(game);
        history.push(`./game/${game.gameId}`);
    }

    return (
        <>
            <div className="home-container">
                <div className="gap-0 grid grid-cols-2 ">
                    <div className={`bg-[#f55a5a] home--column flex justify-center items-center h-screen`}>
                        <button className="rounded-full bg-white border-black border-2 home--buttons p-2.5 text-black text-lg font-bold w-40 h-18 " onClick = {startLocalGame}>Local Play</button>
                    </div>
                    <div className={`bg-[#6b64ff] home--column flex justify-center items-center h-screen`}>
                        <button className="rounded-full bg-white border-black border-2 home--buttons p-2.5 text-black text-lg font-bold w-40 h-18" onClick={handlePlayOnline}>Multiplayer</button>
                    </div>
                </div>
                {showModal && (
                        <div className="modal-container fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg border-2 border-black text-black ">
                        <p className="modal-text text-center text-lg font-bold mb-4 ">Please select mode to play</p>
                        <span className="home--close-btn text-3xl fixed top-2 right-2 cursor-pointer border-2 h-10 w-10 rounded-full text-center pb-1.5 pl-0.2 flex justify-center items-center border-black " onClick = {() => setShowModal(false)}>&times;</span>
                        <footer className="card-footer gap-10 ">
                            {newGameOptions.map(({ label, value }) => (
                                <button className="card-footer-item pointer bg-white text-black rounded h-14 w-32 font-bold m-5 border-2 border-black hover:bg-black hover:text-white transition transform  motion-reduce:transition-none motion-reduce:hover:transform-none" key={value}
                                    onClick={() => startOnlineGame(value)}>
                                    {label}
                                </button>
                            ))}
                        </footer>
                    </div>
                )}
            </div>
        </>
    );
}
