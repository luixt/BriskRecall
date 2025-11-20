import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import './SignUp.css'

export default function SignUp() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()

    // --- Password validation ---
    function validatePassword(pw) {
        const rules = [
            { test: /.{8,}/, message: 'At least 8 characters' },
            { test: /[A-Z]/, message: 'At least 1 uppercase letter' },
            { test: /[a-z]/, message: 'At least 1 lowercase letter' },
            { test: /[0-9]/, message: 'At least 1 number' },
            { test: /[!@#$%^&*]/, message: 'At least 1 special character (!@#$%^&*)' }
        ]
        for (const rule of rules) {
            if (!rule.test.test(pw)) return rule.message
        }
        return null
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        // Validate password
        const pwError = validatePassword(password)
        if (pwError) {
            setError(pwError)
            return
        }

        // Check confirm password
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)
        try {
            const { data, error } = await supabase.auth.signUp({ email, password })
            if (error) throw error

            // Create profile row with the same user id
            const userId = data.user.id
            const { error: profileError } = await supabase.from('profiles').insert({ id: userId, username })
            if (profileError) throw profileError

            alert('Signup successful — check your email for confirmation if enabled')
            nav('/signin')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="signup-wrapper">
            <div className="signup-card">
                <h2>Create account</h2>

                <form onSubmit={handleSubmit}>
                    <input 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        placeholder="Username"
                        required
                    />

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

                    <ul className="password-rules">
                        <li>At least 8 Characters</li>
                        <li>At least 1 Uppercase Letter</li>
                        <li>At least 1 Lowercase Letter</li>
                        <li>At least 1 Number</li>
                        <li>At least 1 Special Character (!@#$%^&*)</li>
                    </ul>

                    <input
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        type="password"
                        required
                    />

                    {error && <div className="error-message">{error}</div>}

                    <button disabled={loading}>
                        {loading ? 'Creating...' : 'Sign up'}
                    </button>
                </form>

                <p>
                    Already have an account? <Link to="/signin">Sign in</Link>
                </p>
            </div>
        </div>
    )
}
