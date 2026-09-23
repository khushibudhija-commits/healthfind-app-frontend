import { useState } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import HospitalCard, { hospitalSlug } from './HospitalCard.jsx';
import { api } from '../services/api.js';

export default function Chatbot({ open, onOpen, onClose }) {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hi. Tell me what treatment you need, your location, budget, or required facility.' }]);
    const send = async (event) => {
        event.preventDefault();
        const message = input.trim();
        if (!message || loading) return;
        setInput('');
        setMessages((current) => [...current, { role: 'user', text: message }]);
        setLoading(true);
        try {
            const result = await api.chat(message);
            setMessages((current) => [...current, { role: 'assistant', text: result.reply, filters: result.filters, hospitals: result.data }]);
        } catch {
            setMessages((current) => [...current, { role: 'assistant', text: 'I could not reach the hospital search right now. Please try again.' }]);
        } finally { setLoading(false); }
    };
    return <>{open && <aside className="chatbot" aria-label="Hospital assistant"><div className="chatbot-header"><div><strong><Bot size={18} /> Care assistant</strong><small>Recommendations from verified hospital data</small></div><button className="icon-button" aria-label="Close assistant" onClick={onClose}><X size={18} /></button></div><div className="chatbot-messages">{messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}><p>{message.text}</p>{message.filters && <div className="chat-filters">{Object.entries(message.filters).flatMap(([key, value]) => Array.isArray(value) ? value.map((item) => <span key={`${key}-${item}`}>{item}</span>) : value ? <span key={key}>{key === 'budget' ? `Under INR ${Number(value).toLocaleString()}` : value}</span> : [])}</div>}{message.hospitals?.map((hospital) => <div className="chat-result-card" key={hospitalSlug(hospital)}><HospitalCard hospital={hospital} selected={false} onCompare={() => { }} /></div>)}</div>)}{loading && <div className="chat-message assistant"><p>Searching hospitals...</p></div>}</div><form className="chatbot-form" onSubmit={send}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Describe your healthcare need..." aria-label="Chat message" /><button type="submit" aria-label="Send message"><Send size={17} /></button></form></aside>}</>;
}