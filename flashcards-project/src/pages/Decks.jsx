import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'
import './Decks.css'

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

    const handleDelete = async (deckId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this deck?");
        if (!confirmDelete) return;

        try {
            const { error } = await supabase.from('decks').delete().eq('id', deckId);
            if (error) throw error;

            setDecks(prev => prev.filter(d => d.id !== deckId));

        } catch (error) {
            console.error("Delete failed:", error.message);
        }
    };


    if(loading) return <p className='loading-text'>Loading...</p>
    return (
        <div className="decks-wrapper">
            <div className="decks-card">
                <h2>Your Decks</h2>
                <ul>
                {decks.map(d => (
                <div key={d.id} className='deck-item'>
                    <Link to={`/deck/${d.id}`} state={{ name: d.title }}>{d.title || 'Untitled deck'}</Link>
                    <button onClick={() => handleDelete(d.id)} className="delete-btn">🗑️</button>
                </div>
                ))}
                </ul>
            </div>
        </div>
    )
}