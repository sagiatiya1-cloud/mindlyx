
import React from 'react'
import { Link } from 'react-router-dom'
import { signInWithGoogle, signOutUser } from '../firebase'

export default function NavBar({ user, setLang, lang, speechEnabled, setSpeechEnabled }:{ user:any, setLang:(l:string)=>void, lang:string, speechEnabled:boolean, setSpeechEnabled:(b:boolean)=>void }){
  return (
    <header className="topbar">
      <div className="brand"><img src="/icon-192.png" className="logo" /><span>Mindlyx</span></div>
      <nav className="nav">
        <Link to="/" className="navlink">Home</Link>
        <Link to="/study" className="navlink">Study</Link>
        <Link to="/profile" className="navlink">Profile</Link>
      </nav>
      <div className="nav-actions">
        <select value={lang} onChange={e=>setLang(e.target.value)}>
          <option value="en">EN</option>
          <option value="he">HE</option>
          <option value="es">ES</option>
          <option value="fr">FR</option>
          <option value="ar">AR</option>
          <option value="zh">ZH</option>
          <option value="hi">HI</option>
        </select>
        <label style={{marginLeft:8}}><input type="checkbox" checked={speechEnabled} onChange={e=>setSpeechEnabled(e.target.checked)} /> Speech</label>
        {user ? <><span style={{marginLeft:8}}>{user.displayName || user.email}</span><button className="ghost" onClick={()=>signOutUser()}>Logout</button></> :
        <><button onClick={()=>signInWithGoogle()}>Sign in with Google</button></>}
      </div>
    </header>
  )
}
