import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel';
import HospitalCard, { hospitalSlug } from '../components/HospitalCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { api } from '../services/api';

const treatments = ['Knee Replacement', 'Cataract Surgery', 'Heart Surgery', 'Gallbladder Surgery', 'Fracture Treatment', 'Chest Treatment'];
const facilities = ['MRI', 'CT Scan', 'ICU', 'Emergency', 'Blood Bank', 'Pharmacy', 'Ambulance'];

export default function Hospitals() {
    const location = useLocation();
    const [filters, setFilters] = useState({ location: '', type: '', treatment: location.state?.treatment || '', facilities: '', budget: '' });
    const [hospitals, setHospitals] = useState([]);
    const [compare, setCompare] = useState(() => JSON.parse(localStorage.getItem('healthfind-compare') || '[]'));
    const [status, setStatus] = useState('loading');
    const load = async () => { setStatus('loading'); try { const result = await api.hospitals(filters); setHospitals(result.data || []); setStatus('ready'); } catch { setStatus('error'); } };
    const toggleCompare = (hospital) => {
        const exists = compare.some((item) => hospitalSlug(item) === hospitalSlug(hospital));
        const next = exists ? compare.filter((item) => hospitalSlug(item) !== hospitalSlug(hospital)) : compare.length < 3 ? [...compare, hospital] : compare;
        setCompare(next);
        localStorage.setItem('healthfind-compare', JSON.stringify(next));
    };
    useEffect(() => { load(); }, []);
    return <section className="directory section"><div className="page-heading"><div><p className="eyebrow">Punjab care directory</p><h1>Find your hospital.</h1><p>Search, filter and compare care options.</p></div><Link className="secondary-button" to="/compare">Compare list ({compare.length})</Link></div><div className="directory-layout"><FilterPanel filters={filters} setFilters={setFilters} options={{ treatments, facilities }} onApply={load} /><div className="results"><div className="results-toolbar"><strong>{status === 'ready' ? hospitals.length : '...'} hospitals</strong></div>{status === 'loading' && <Loading />}{status === 'error' && <ErrorMessage />}{status === 'ready' && hospitals.length === 0 && <div className="empty"><h3>No hospitals found</h3><p>Try changing your location, budget or treatment.</p></div>}{status === 'ready' && hospitals.map((hospital) => <HospitalCard key={hospitalSlug(hospital)} hospital={hospital} selected={compare.some((item) => hospitalSlug(item) === hospitalSlug(hospital))} onCompare={toggleCompare} />)}</div></div></section>;
}
