import { React, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Nav.css';

export default function Nav({ session }) {
  const nav = useNavigate();
  const location = useLocation();

  async function signOut() {
    await supabase.auth.signOut();
    nav('/signin');
  }

  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <nav className="nav">
      {/* Home Link */}
      <Link 
        to="/" 
        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
      >
        Home
      </Link>

      {/* Always available links */}
      {session && (
        <>
          <Link 
            to="/decks" 
            className={`nav-link ${location.pathname === '/decks' ? 'active' : ''}`}
          >
            Decks
          </Link>
          <Link 
            to="/upload" 
            className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}
          >
            Upload
          </Link>
        </>
      )}

      {/* Auth links */}
      {session ? (
        <button className="nav-btn" onClick={signOut}>
          Sign Out
        </button>
      ) : (
        <>
          <Link 
            to="/signin" 
            className={`nav-link ${location.pathname === '/signin' ? 'active' : ''}`}
          >
            Sign In
          </Link>
          <Link 
            to="/signup" 
            className={`nav-link ${location.pathname === '/signup' ? 'active' : ''}`}
          >
            Sign Up
          </Link>
        </>
      )}

      <div className="nav-right">
        <button className="theme-toggle" onClick={() => setDark(!dark)}>
          {dark ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </nav>
  );
}
