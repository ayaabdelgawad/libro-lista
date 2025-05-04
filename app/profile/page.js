'use client';

import { useEffect, useState } from 'react';
import NavBar from "../components/NavBar";
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();
    const [refresh, setRefresh] = useState(false);
    const [reader, setReader] = useState('');
    useEffect(() => {
        const cookies = document.cookie;
        const match = cookies.match(/username=([^;]+)/);
        const username = match ? match[1] : null;

        if (!username) {
            router.push('/login');
        } else {
            setReader(username);
        }
    }, [refresh]);

    async function updateUsername(formData) {
        const pwd = formData.get("pwdConfirm");
        const newUsername = formData.get("newUsername");
        const payload = {username: reader, newUsername, password: pwd}
        await fetch('/api/auth/update-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        setRefresh(!refresh);
    }

    async function updatePassword(formData) {
        const pwd = formData.get("pwdConfirm");
        const newPassword = formData.get("newPassword");
        const payload = {username: reader, newPassword, password: pwd}
        await fetch('/api/auth/update-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        setRefresh(!refresh);
    }

    async function deleteProfile(formData) {
        const pwd = formData.get("pwdConfirm");
        const payload = {username: reader, password: pwd}
        await fetch('/api/auth/delete-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        setRefresh(!refresh);
    }
    
    return (<div>
        <NavBar/>
        <h1 className="text-4xl"><b>{reader}</b>'s Profile</h1>
        <h3 className="text-2xl">Update Username</h3>
        <form
            className="text-black flex flex-col" 
            onSubmit={(event) => {
                event.preventDefault(); 
                const formData = new FormData(event.target);
                updateUsername(formData);
            }}
        >
            <label>New Username</label>
            <input name="newUsername"></input>
            <label>Type Password to Confirm Update</label>
            <input type="password" name="pwdConfirm"></input>
            <button type="submit">Confirm</button>
        </form>
        
        <h3 className="text-2xl">Update Password</h3>
        <form
            className="text-black flex flex-col" 
            onSubmit={(event) => {
                event.preventDefault(); 
                const formData = new FormData(event.target);
                updatePassword(formData);
            }}
        >
            <label>New Password</label>
            <input type="password" name="newPassord"></input>
            <label>Type Old Password to Confirm Update</label>
            <input type="password" name="pwdConfirm"></input>
            <button type="submit">Confirm</button>
        </form>

        <h3 className="text-2xl">Delete Profile</h3>
        <form
            className="text-black flex flex-col" 
            onSubmit={(event) => {
                event.preventDefault(); 
                const formData = new FormData(event.target);
                deleteProfile(formData);
            }}
        >
            <p>WARNING! This action is irrevocable!</p>
            <label>Type Password to Confirm Delete</label>
            <input type="password" name="pwdConfirm"></input>
            <button type="submit">Confirm</button>
        </form>
    </div>)
}