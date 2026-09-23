import { Link } from 'react-router-dom';

export default function Compare() {
    const hospitals = JSON.parse(localStorage.getItem('healthfind-compare') || '[]');
    return <section className="section compare-page"><div className="page-heading"><div><p className="eyebrow">Your shortlist</p><h1>Compare hospitals.</h1><p>Review your selected hospitals side by side.</p></div><Link className="secondary-button" to="/hospitals">Add hospitals</Link></div>{hospitals.length < 2 ? <div className="compare-empty"><h2>Add at least two hospitals</h2><p>Use Compare from the hospital directory to build your shortlist.</p><Link className="primary-button" to="/hospitals">Explore hospitals</Link></div> : <div className="comparison"><div className="comparison-labels"><div>Compare</div><div>Type</div><div>Location</div><div>Treatments</div></div>{hospitals.slice(0, 3).map((hospital) => <div className="comparison-column" key={hospital.name}><div className="compare-hospital"><strong>{hospital.name}</strong></div><div>{hospital.type}</div><div>{hospital.city}, {hospital.district}</div><div>{hospital.treatments?.length || 0} listed</div></div>)}</div>}</section>;
}
