import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link, useNavigate } from 'react-router-dom'


export default function SignUp(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()


    async function handleSubmit(e){
        e.preventDefault(); setLoading(true)
        try{
            const { data, error } = await supabase.auth.signUp({ email, password })
            if(error) throw error


            // Create profile row with the same user id
            const userId = data.user.id
            const { error: profileError } = await supabase.from('profiles').insert({ id: userId, username })
            if(profileError) throw profileError


            alert('Signup successful — check your email for confirmation if enabled')
            nav('/signin')
        }catch(err){
            alert(err.message)
        }finally{ setLoading(false) }
    }


    return (
        <div className="card">
        <h2>Create account</h2>
        <form onSubmit={handleSubmit}>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" required />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" type="email" required />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" required />
        <button disabled={loading}>{loading ? 'Creating...' : 'Sign up'}</button>
        </form>
        <p>Already have an account? <Link to="/signin">Sign in</Link></p>
        </div>
    )
}