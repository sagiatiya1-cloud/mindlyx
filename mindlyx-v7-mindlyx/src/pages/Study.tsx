
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

function speak(text:string, enabled:boolean, lang:string){
  if(!enabled) return
  try{
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang==='he' ? 'he-IL' : 'en-US'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }catch(e){ console.warn(e) }
}

export default function Study({ user, lang, speechEnabled }:{ user:any, lang:string, speechEnabled:boolean }){
  const [note,setNote] = useState(localStorage.getItem('mindlyx_note')||'')
  const [messages,setMessages] = useState<any[]>([])

  useEffect(()=>{
    if(note){
      const intro = (lang==='he')? `היי ${user?.displayName || user?.email || ''}! מצאתי חומר ללמוד.` : `Hey ${user?.displayName || user?.email || ''}! I found some notes.`
      appendBot(intro)
      analyze(note)
    } else {
      appendBot(lang==='he' ? 'הדבק פתקים כדי להתחיל.' : 'Paste notes to analyze.')
    }
  },[])

  function appendBot(text:string){ setMessages(m=>[...m,{from:'bot', text}]); speak(text, speechEnabled, lang) }
  function appendUser(text:string){ setMessages(m=>[...m,{from:'user', text}]) }

  async function analyze(content:string){
    appendUser(content)
    // Try backend AI endpoint first
    try{
      const resp = await fetch('/api/generate', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ text: content }) })
      const data = await resp.json()
      if(data?.items){
        appendBot('I generated exercises and puzzles for you.')
        for(const it of data.items) appendBot(`${it.type.toUpperCase()}: ${it.q}`)
        await addDoc(collection(db, 'generated'), { user: user?.uid || null, createdAt: Date.now(), items: data.items })
        return
      }
    }catch(e){ console.warn('backend error', e) }

    // Local fallback analysis (simple heuristics)
    const lower = content.toLowerCase()
    let topic = 'General'
    if(lower.includes('root')||lower.includes('שורש')||lower.includes('formula')) topic='Roots formula'
    if(lower.includes('derivative')||lower.includes('נגזרת')) topic='Derivatives'

    const items = [
      {type:'main', q: lang==='he' ? 'סכם במשפט את הרעיון המרכזי' : 'Summarize the main idea in one sentence.'},
      {type:'fill', q: content.split('.')[0].slice(0,120) + ' ...', a:''},
      {type:'mcq', q: `Which statement best matches the concept "${topic}"?`, choices:['A','B','C'], a:''},
      {type:'puzzle', q: lang==='he' ? 'פאזל: התאמה בין מונחים' : 'Puzzle: match terms with definitions' }
    ]

    appendBot('Generated exercises (local fallback).')
    for(const it of items) appendBot(`${it.type.toUpperCase()}: ${it.q}`)
    try{ await addDoc(collection(db, 'generated'), { user: user?.uid || null, createdAt: Date.now(), items }) }catch(e){ console.warn('Could not save', e) }
  }

  return (
    <div style={{maxWidth:900, margin:'20px auto'}}>
      <div className="card"><h2>{lang==='he' ? 'למידה חכמה' : 'Smart Study'}</h2><div className="small">Bot will generate exercises from your notes.</div></div>
      <div style={{marginTop:12}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:'flex', justifyContent: m.from==='bot' ? 'flex-start' : 'flex-end', marginBottom:8}}>
            {m.from==='bot' ? <div className="bubble bot">{m.text}</div> : <div className="bubble user">{m.text}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
