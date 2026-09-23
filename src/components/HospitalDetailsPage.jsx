import { useEffect, useState } from 'react';
import { Check, Clock3, MapPin, Phone } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Loading from './Loading.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import { api } from '../services/api.js';
import { hospitalSlug } from './HospitalCard.jsx';

export default function HospitalDetailsPage({ compare, toggle }) {
    const { id } = useParams();
    const [hospital, setHospital] = useState();
    const [error, setError] = useState(false);
    useEffect(() => { api.hospital(id).then((result) => setHospital(result.data)).catch(() => setError(true)); }, [id]);
    if (error) return <section className="section"><ErrorMessage message="We couldn't find that hospital." /></section>;
    if (!hospital) return <section className="section"><Loading /></section>;
    return <section className="details section"><Link className="back-link" to="/hospitals">← Back to hospitals</Link><div className="detail-hero"><div className="hospital-monogram large">{hospital.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}</div><div><p className="eyebrow">{hospital.type} care provider</p><h1>{hospital.name}</h1><p className="detail-location"><MapPin size={16} /> {hospital.address}, {hospital.city}, {hospital.district}, {hospital.state}</p><p className="detail-location"><Phone size={16} /> Reception: {hospital.receptionPhone || hospital.phone || 'Not available'}</p></div><button className="primary-button detail-compare" onClick={() => toggle(hospital)}>{compare.some((item) => hospitalSlug(item) === hospitalSlug(hospital)) ? 'Added to compare' : 'Compare hospital'}</button></div><div className="detail-grid"><div><div className="detail-panel"><div className="panel-heading"><h2>Available facilities</h2><span>{hospital.facilities?.length || 0} listed</span></div><div className="facility-list">{hospital.facilities?.map((facility) => <span key={facility}><Check size={15} /> {facility}</span>)}</div></div><div className="detail-panel"><div className="panel-heading"><h2>Treatments & outcomes</h2><span>Demo estimates</span></div><div className="treatment-table">{hospital.treatments?.map((item) => <div className="treatment-row" key={item.name}><div><strong>{item.name}</strong><small>{item.category}</small></div><span>INR {item.estimatedCost.min.toLocaleString()} - {item.estimatedCost.max.toLocaleString()}</span><b>{item.outcomeRate}% <small>success rate</small></b></div>)}</div></div></div><aside><div className="detail-panel"><div className="panel-heading"><h2>Doctor availability</h2><span>{hospital.doctorAvailability?.length || 0} days</span></div><div className="availability-list">{hospital.doctorAvailability?.map((slot) => <div key={slot.day}><strong><Clock3 size={14} /> {slot.day}</strong><span>{slot.timing}</span><small>{slot.departments?.join(', ')}</small></div>)}</div></div></aside></div></section>;
}