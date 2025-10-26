import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'


export default function DeckView(){
    const { id } = useParams()
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect(()=>{
        let mounted = true
        async function fetchCards(){
            const { data, error } = await supabase.from('flashcards').select('*').eq('deck_id', id)
            if(error) return alert(error.message)
            if(mounted) setCards(data)
            setLoading(false)
        }
        fetchCards()
        return ()=> mounted = false
    }, [id])


    if(loading) return <p>Loading cards...</p>


    return (
        <div>
            <h2>Deck cards</h2>
            <ol>
            {cards.map(c => (
            <li key={c.id}>
            <strong>Q:</strong> {c.question_text}
            <br/>
            <strong>A:</strong> {c.answer_text}
            </li>
            ))}
            </ol>
        </div>
    )
}