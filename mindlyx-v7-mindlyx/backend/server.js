
/*
Simple Express server to proxy OpenAI calls.
Set OPENAI_API_KEY environment variable.
Deploy as serverless (Vercel) or Node host.
*/
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
const app = express();
app.use(cors()); app.use(express.json());

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

app.post('/api/generate', async (req,res)=>{
  const text = req.body.text || '';
  if(!text) return res.status(400).json({ error: 'no text' });
  try{
    const prompt = `You are a smart tutor. Given these notes, return JSON: { items: [ {type:'mcq'|'fill'|'puzzle'|'explain', q:'', choices:[], answer:'', difficulty:'easy|medium|hard'} ] }\nNotes:\n${text}\nReturn valid JSON.`;
    const completion = await openai.createCompletion({ model: "gpt-4o-mini", prompt, max_tokens:800, temperature:0.2 });
    const raw = completion.data.choices[0].text || '';
    let parsed = null;
    try{ parsed = JSON.parse(raw); }catch(e){ parsed = { items: [ { type:'explain', q: raw.slice(0,800), difficulty:'medium' } ] }; }
    res.json(parsed);
  }catch(e){ console.error(e); res.status(500).json({ error: 'Generation failed', details: e.toString() }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Server on', PORT));
