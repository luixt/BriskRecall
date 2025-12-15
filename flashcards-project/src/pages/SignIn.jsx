import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import './SignIn.css'


export default function SignIn(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [helpOpen, setHelpOpen] = useState(false)
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

    // Further functionality for password reset
    // const handlePasswordReset = async () => {
    //     const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    //     redirectTo: `${window.location.origin}/reset-password`
    //     });

    //     if (error) {
    //     console.error(error);
    //     setMessage('Error sending reset email.');
    //     } else {
    //     setMessage('Password reset email sent! Check your inbox.');
    //     }
    // };


    return (
        <div className="signin-wrapper">
            <div className="signin-card">
                <h2>Sign In</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                        type="email"
                        required
                    />

                    <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                        required
                    />

                    <button disabled={loading}>
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                <p>
                    Don't have an account?  <Link to="/signup">Sign up</Link>
                </p>
            </div>

            {helpOpen && (
                <div className="help-card">
                    <h3>Need Help?</h3>
                    <p>If you're having trouble signing in, you can reset your password or learn more about how our platform works.</p>
                    <p 
                    className="forgot"
                    // onClick={handlePasswordReset}
                    >
                    Click Here.
                    </p>
                </div>
            )}

            {/* Bubble (toggles helpOpen) */}
            <button 
                className="help-bubble"
                onClick={() => setHelpOpen(x => !x)}   // <--- toggle
            >
                ?
            </button>
        </div>
    )
}