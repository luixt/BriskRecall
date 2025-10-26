import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'


export default function Decks(){
    const [decks, setDecks] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect(()=>{
        let mounted = true
            async function fetchDecks(){
            const { data, error } = await supabase.from('decks').select('*').order('created_at', { ascending: false })
            if(error) return alert(error.message)
            if(mounted) setDecks(data)
            setLoading(false)
        }
        fetchDecks()
        return ()=> mounted = false
    }, [])


    if(loading) return <p>Loading...</p>
    return (
        <div>
            <h2>Your decks</h2>
            <ul>
            {decks.map(d => (
            <li key={d.id}><Link to={`/deck/${d.id}`}>{d.title || 'Untitled deck'}</Link></li>
            ))}
            </ul>
        </div>
    )
}