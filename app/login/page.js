'use client';
import { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export default function Page(){
    const [refresh, setRefresh] = useState(false);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const [readers, setReaders] = useState([])
    useEffect(() => {
        fetch('/api/readers')
          .then((response) => response.json())
          .then((data) => {setReaders(data)});
      }, [refresh]);


    async function doLogin() {
        //COME BACK TO THIS
    }

    async function doSignUp() {
        if (readers.filter((reader) => reader.username === username)) {
            alert("The username you have chose is already taken");
        } else {
            
            
            bcrypt.hash(password, SALT_ROUNDS).then((hash) => {
                const payload = {username, pw_hash: hash.slice(-31), salt: hash.slice(-53, -31)};
                fetch('/api/readers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            })
        }
        setRefresh(!refresh)
    }

    return (
        <div>
            <label>Username</label>
            <input 
                type="text"
                onChange={(event) => {
                    setUsername(event.target.value);
                }}
            ></input>
            <label>Password</label>
            <input 
                type="password" 
                onChange={(event) => {
                    setPassword(event.target.value);
                }}
            ></input>
            <button onClick={doLogin}>Login</button>
            <button onClick={doSignUp}>Sign Up</button>
        </div>
    )
}