const API_URL = import.meta.env.VITE_API_URL || 'https://healthfind-app-backend.onrender.com/api';

async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || 'Request failed');
    return payload;
}

export const api = {
    hospitals: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(filters)) {
            if (value != null && value !== '') {
                if (Array.isArray(value)) {
                    value.forEach((v) => queryParams.append(key, v));
                } else {
                    queryParams.set(key, value);
                }
            }
        }
        return request(`/hospitals?${queryParams.toString()}`);
    },

    treatments: () => request('/treatments'),

    facilities: (treatment = '') => {
        const query = treatment ? `?treatment=${encodeURIComponent(treatment)}` : '';
        return request(`/facilities${query}`);
    },

    hospital: (id, coords = null) => {
        const query = coords && coords.latitude && coords.longitude
            ? `?latitude=${coords.latitude}&longitude=${coords.longitude}`
            : '';
        return request(`/hospitals/${id}${query}`);
    },

    search: (filters = {}) => {
        return request('/search', {
            method: 'POST',
            body: JSON.stringify(filters)
        });
    },

    aiSearch: (query, filters = {}, coords = null) => {
        return request('/search/ai', {
            method: 'POST',
            body: JSON.stringify({
                query,
                filters,
                originLatitude: coords?.latitude,
                originLongitude: coords?.longitude
            })
        });
    },

    chat: (message) => {
        return request('/search/chat', {
            method: 'POST',
            body: JSON.stringify({ message })
        });
    },

    nearby: (latitude, longitude, maxDistance = null) => {
        const query = new URLSearchParams({ latitude, longitude });
        if (maxDistance) query.set('maxDistance', maxDistance);
        return request(`/hospitals/nearby?${query.toString()}`);
    },

    submitEmergencyRequest: (contactNumber, latitude, longitude) => {
        const payload = {
            contactNumber: String(contactNumber || '').trim(),
            latitude: Number(latitude),
            longitude: Number(longitude)
        };
        return request('/emergency-requests', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },

    drivingDistance: (originLatitude, originLongitude, destinationLatitude, destinationLongitude) => {
        const query = new URLSearchParams({
            originLatitude,
            originLongitude,
            destinationLatitude,
            destinationLongitude
        });
        return request(`/hospitals/distance?${query.toString()}`);
    }
};
