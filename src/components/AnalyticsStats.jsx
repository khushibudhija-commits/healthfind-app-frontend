import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

const treatments = ['Knee Replacement', 'Cataract Surgery', 'Heart Surgery', 'Gallbladder Surgery', 'Fracture Treatment', 'Chest Treatment'];

export default function AnalyticsStats() {
    const [disease, setDisease] = useState('');
    const [analytics, setAnalytics] = useState();
    useEffect(() => { api.treatmentAnalytics(disease).then((result) => setAnalytics(result.data)).catch(() => setAnalytics(null)); }, [disease]);
    const metrics = [[analytics?.totalPatientsTreated?.toLocaleString() || '...', 'Patients treated'], [analytics?.averageCost ? `INR ${analytics.averageCost.toLocaleString()}` : '...', 'Average cost'], [analytics?.successRate ? `${analytics.successRate}%` : '...', 'Success rate'], [analytics?.treatmentCount || '...', 'Matching treatments']];
    return <section className="analytics-stats"><div className="analytics-heading"><strong>Care outcomes</strong><label>Disease or treatment<select value={disease} onChange={(event) => setDisease(event.target.value)}><option value="">All treatments</option>{treatments.map((item) => <option key={item} value={item}>{item}</option>)}</select></label></div><div className="stats">{metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>{analytics?.patientsTreatedIsEstimate && <small className="analytics-note">Patient totals are demo estimates until treatment volume data is added.</small>}</section>;
}