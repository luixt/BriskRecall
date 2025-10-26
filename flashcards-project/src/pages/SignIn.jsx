import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link, useNavigate } from 'react-router-dom'


export default function SignIn(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()


    async function handleSubmit(e){
        e.preventDefault(); setLoading(true)
        try{
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            if(error) throw error
            // session is automatically stored by supabase client in localStorage
            nav('/decks')
        }catch(err){
            alert(err.message)
        }finally{ setLoading(false) }
    }


    return (
        <div className="card">
        <h2>Sign in</h2>
        <form onSubmit={handleSubmit}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" type="email" required />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" required />
        <button disabled={loading}>{loading ? 'Signing...' : 'Sign in'}</button>
        </form>
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
    )
}