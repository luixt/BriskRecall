import React, { useState } from 'react'
import { supabase } from '../supabaseClient'


// This component uploads the user's PDF to your backend endpoint '/api/upload'
// The backend should verify the supabase session (bearer token) and then process the file
export default function UploadForm(){
    const [file, setFile] = useState(null)
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)


    async function handleSubmit(e){
        e.preventDefault()
        if(!file) return alert('Select a PDF file')
        setLoading(true)


        // Get current session (to forward token to backend)
        const { data: { session } } = await supabase.auth.getSession()
        if(!session) return alert('Not authenticated')


        const form = new FormData()
        form.append('file', file)
        form.append('title', title)


        try{
            // Upload to backend which will call Pinecone + Gemini and return generated Q/A
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                Authorization: `Bearer ${session.access_token}`
                },
                body: form
            })


            if(!res.ok) throw new Error(await res.text())
            const payload = await res.json()


            // payload should include: { deckTitle, cards: [{question, answer}, ...] }
            const { deckTitle, cards } = payload


            // 1) Insert deck into Supabase
            const userId = session.user.id
            const { data: deckData, error: deckErr } = await supabase.from('decks').insert([{ user_id: userId, title: deckTitle || title }]).select().single()
            if(deckErr) throw deckErr


            const deckId = deckData.id


            // 2) Insert flashcards in batch
            const toInsert = cards.map((c, idx) => ({ deck_id: deckId, question_text: c.question, answer_text: c.answer }))
            const { error: cardsErr } = await supabase.from('flashcards').insert(toInsert)
            if(cardsErr) throw cardsErr


            alert('Deck and cards saved successfully')
            setFile(null)
            setTitle('')
        }catch(err){
        console.error(err)
            alert(err.message)
        }finally{ setLoading(false) }
    }


    return (
        <form onSubmit={handleSubmit} className="card">
        <label>Deck title</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Spanish - Chapter 1" />


        <label>PDF file</label>
        <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files?.[0] || null)} />


        <button type="submit" disabled={loading}>{loading ? 'Processing...' : 'Upload & Generate 15 Q/A'}</button>
        </form>
    )
}