import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/footer.jsx';
import { EmergencyFloatingButton } from './components/EmergencyButton.jsx';
import Chatbot from './components/Chatbot.jsx';
import { hospitalSlug } from './components/HospitalCard.jsx';

// Pages
import Home from './pages/home.jsx';
import Hospitals from './pages/Hospitals.jsx';
import SearchResults from './pages/searchresults.jsx';
import HospitalDetails from './pages/hospitaldetails.jsx';
import CompareHospitals from './pages/CompareHospitals.jsx';
import Treatments from './pages/treatments.jsx';
import Emergency from './pages/Emergency.jsx';
import About from './pages/about.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
    const location = useLocation();
    const isNotFound = ![
        '/',
        '/hospitals',
        '/search',
        '/compare',
        '/treatments',
        '/emergency',
        '/about'
    ].includes(location.pathname) && !location.pathname.startsWith('/hospitals/');

    // 1. Comparison Shortlist in LocalStorage (Max 3)
    const [compare, setCompare] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('healthfind_compare') || '[]');
        } catch {
            return [];
        }
    });

    const toggleCompare = (hospital) => {
        setCompare((current) => {
            const exists = current.some((item) => hospitalSlug(item) === hospitalSlug(hospital));
            let next;
            if (exists) {
                next = current.filter((item) => hospitalSlug(item) !== hospitalSlug(hospital));
            } else if (current.length < 3) {
                next = [...current, hospital];
            } else {
                next = current;
            }
            try {
                localStorage.setItem('healthfind_compare', JSON.stringify(next));
            } catch {
                // Ignore storage errors
            }
            return next;
        });
    };

    const clearCompare = () => {
        setCompare([]);
        try {
            localStorage.removeItem('healthfind_compare');
        } catch {
            // Ignore
        }
    };

    // 2. Optional user coordinates cache
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    setUserLocation({ latitude: coords.latitude, longitude: coords.longitude });
                },
                () => {
                    // Geolocation declined or unavailable
                },
                { timeout: 8000 }
            );
        }
    }, []);

    // 4. Care Assistant Drawer state
    const [assistantOpen, setAssistantOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-[#f8fbfc] text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
            {!isNotFound && (
                <Navbar
                    compareCount={compare.length}
                    onOpenAssistant={() => setAssistantOpen(true)}
                />
            )}

            {/* Application Routes */}
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route
                        path="/hospitals"
                        element={
                            <Hospitals
                                compare={compare}
                                toggleCompare={toggleCompare}
                                userLocation={userLocation}
                                setUserLocation={setUserLocation}
                            />
                        }
                    />

                    <Route
                        path="/search"
                        element={
                            <SearchResults
                                compare={compare}
                                toggleCompare={toggleCompare}
                                userLocation={userLocation}
                            />
                        }
                    />

                    <Route
                        path="/hospitals/:id"
                        element={
                            <HospitalDetails
                                compare={compare}
                                toggleCompare={toggleCompare}
                                userLocation={userLocation}
                            />
                        }
                    />

                    <Route
                        path="/compare"
                        element={
                            <CompareHospitals
                                hospitals={compare}
                                toggleCompare={toggleCompare}
                                clearCompare={clearCompare}
                            />
                        }
                    />

                    <Route path="/treatments" element={<Treatments />} />

                    <Route path="/emergency" element={<Emergency />} />

                    <Route path="/about" element={<About />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>

            {!isNotFound && <EmergencyFloatingButton />}

            {!isNotFound && (
                <Chatbot
                    open={assistantOpen}
                    onOpen={() => setAssistantOpen(true)}
                    onClose={() => setAssistantOpen(false)}
                />
            )}

            {!isNotFound && <Footer />}
        </div>
    );
}
