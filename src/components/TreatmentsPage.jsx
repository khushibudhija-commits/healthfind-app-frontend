import { useEffect, useState } from 'react';
import { Activity, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import { api } from '../services/api.js';

export default function TreatmentsPage() {
    const navigate = useNavigate();
    const [treatments, setTreatments] = useState([]);
    const [status, setStatus] = useState('loading');
    useEffect(() => { api.treatments().then((result) => { setTreatments(result.data); setStatus('ready'); }).catch(() => setStatus('error')); }, []);
    if (status === 'loading') return <section className="section"><Loading /></section>;
    if (status === 'error') return <section className="section"><ErrorMessage message="We couldn't load the treatments right now." /></section>;
    return <section className="section simple-page"><p className="eyebrow">Care, by category</p><h1>Explore treatments.</h1><p className="lead">Every treatment below is available at one or more hospitals in the directory.</p><div className="treatment-grid">{treatments.map((item, index) => <button key={item} onClick={() => navigate('/hospitals', { state: { treatment: item } })}><span className={`treatment-icon ti-${index % 6}`}><Activity size={21} /></span><strong>{item}</strong><ArrowRight size={18} /></button>)}</div></section>;
}