import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'


export default function Nav({ session }){
    const nav = useNavigate()


    async function signOut(){
    await supabase.auth.signOut()
    nav('/signin')
    }


    return (
        <nav className="nav">
        <Link to="/decks">Decks</Link>
        <Link to="/upload">Upload</Link>
        {session ? (
        <button onClick={signOut}>Sign out</button>
        ) : (
        <>
        <Link to="/signin">Sign in</Link>
        <Link to="/signup">Sign up</Link>
        </>
        )}
        </nav>
    )
}