import { useState } from 'react';
import { auth } from './firebase';

export default function UserForm() {
    const [name, setName] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        localStorage.setItem('userName', name);
        await auth.signInAnonymously();
    }

    return (
        <form className="user-form m-14" onSubmit={handleSubmit}>
            <h1 className="text-3xl font-bold">Enter your name to start</h1>
            <br />
            <div className="mt-4">       
                <input
                    type="text"
                    name=""
                    id=""
                    className="w-full border border-2 border-gray rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
            </div> 
            <div className="mt-4">
                <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" type="submit">Start</button>
            </div>    
        </form>
    );
}
