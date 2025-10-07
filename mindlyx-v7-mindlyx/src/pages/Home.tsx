
import React, { useState } from 'react'
import { signUpEmail, signInEmail } from '../firebase'
import { useNavigate } from 'react-router-dom'
import en from '../i18n/en.json'
import he from '../i18n/he.json'
import es from '../i18n/es.json'
import fr from '../i18n/fr.json'
import ar from '../i18n/ar.json'
import zh from '../i18n/zh.json'
import hi from '../i18n/hi.json'

const dict:any = { en, he, es, fr, ar, zh, hi }

export default function Home({ user, lang, speechEnabled }:{ user:any, lang:string, speechEnabled:boolean }){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [note,setNote] = useState('')
  const nv = useNavigate()
  const t = dict[lang] || dict['en']

  async function doSignUp(){ try{ await signUpEmail(email,password); alert('Signed up'); } catch(e:any){ alert('Error: '+e.message) } }
  async function doSignIn(){ try{ await signInEmail(email,password); alert('Signed in'); nv('/study') } catch(e:any){ alert('Error: '+e.message) } }
  function startAnalyze(){ localStorage.setItem('mindlyx_note', note); nv('/study') }

  return (
    <div style={{maxWidth:900, margin:'20px auto'}} className="card">
      <h2>{t.welcome}</h2>
      <div className="small">Sign up with email or use Google. Paste notes to start.</div>
      <div style={{display:'flex',gap:8, marginTop:8}}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button onClick={doSignIn}>Sign in</button>
        <button className="ghost" onClick={doSignUp}>Create</button>
      </div>
      <hr style={{margin:'12px 0'}}/>
      <h3>{t.paste_notes}</h3>
      <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={t.paste_notes} />
      <div style={{marginTop:8}}><button onClick={startAnalyze}>{t.analyze}</button></div>
    </div>
  )
}
