'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export default function Page(){
    const router = useRouter();
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
        const payload = {username, password};
        fetch('api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(res => res.json()).then((data) => {
            if(data.success){
                router.push(data.redirectTo);
            }
        })
    }

    async function doSignUp() {
        const matchingUsernames = readers.filter((reader) => reader.username === username)
        if (matchingUsernames.length > 0) {
            alert("The username you have chosen is already taken");
            console.log(matchingUsernames)
        } else {            
            bcrypt.hash(password, SALT_ROUNDS).then((hash) => {
                const payload = {username, pw_hash: hash.slice(-31), salt: hash.slice(-53, -31)};
                fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }).then(res => res.json()).then((data) => {
                    if(data.success){
                        router.push(data.redirectTo);
                    }
                });
            })
        }
        setRefresh(!refresh)
    }

    return (
        <div>
        <form className="flex flex-col">
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
        </form>
            <button onClick={doLogin}>Login</button>
            <button onClick={doSignUp}>Sign Up</button>
        </div>
    )
}