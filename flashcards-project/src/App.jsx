import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Upload from './pages/Upload'
import Decks from './pages/Decks'
import DeckView from './pages/DeckView'
import Nav from './components/Nav'
import { supabase } from './supabaseClient'


export default function App(){
  const [session, setSession] = useState(null)


  useEffect(() => {
    const s = supabase.auth.getSession().then(res => {
      if(res.data?.session) setSession(res.data.session)
    })


    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })


    return () => listener?.subscription?.unsubscribe && listener.subscription.unsubscribe()
  }, [])


  return (
    <div className="app">
      <Nav session={session} />


      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/decks" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/upload" element={session ? <Upload session={session} /> : <Navigate to="/signin" replace />} />
          <Route path="/decks" element={session ? <Decks /> : <Navigate to="/signin" replace />} />
          <Route path="/deck/:id" element={session ? <DeckView /> : <Navigate to="/signin" replace />} />
        </Routes>
      </main>
    </div>
  )
}