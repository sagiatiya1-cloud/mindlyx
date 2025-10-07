
import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Study from './pages/Study'
import Profile from './pages/Profile'
import NavBar from './components/NavBar'
import { onAuthChange } from './firebase'

export default function App(){
  const [user, setUser] = useState<any>(null)
  const [lang, setLang] = useState(localStorage.getItem('mindlyx_lang')||'en')
  const [speechEnabled, setSpeechEnabled] = useState(localStorage.getItem('mindlyx_speech')==='true')
  const navigate = useNavigate()

  useEffect(()=>{
    const unsub = onAuthChange((u)=>{ setUser(u); if(u) navigate('/study'); })
    return ()=>unsub && unsub()
  },[])

  useEffect(()=>{ localStorage.setItem('mindlyx_lang', lang) }, [lang])
  useEffect(()=>{ localStorage.setItem('mindlyx_speech', speechEnabled ? 'true' : 'false') }, [speechEnabled])

  return (
    <div>
      <NavBar user={user} setLang={setLang} lang={lang} speechEnabled={speechEnabled} setSpeechEnabled={setSpeechEnabled} />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home user={user} lang={lang} speechEnabled={speechEnabled} />} />
          <Route path="/study" element={<Study user={user} lang={lang} speechEnabled={speechEnabled} />} />
          <Route path="/profile" element={<Profile user={user} />} />
        </Routes>
      </main>
    </div>
  )
}
