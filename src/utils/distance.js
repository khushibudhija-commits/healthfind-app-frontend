/**
 * Client-side Haversine Distance & Navigation Utilities
 */

export function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
    if ([lat1, lon1, lat2, lon2].some((v) => v == null || Number.isNaN(Number(v)))) return null;
    const R = 6371; // Earth's radius in kilometers
    const toRad = (angle) => (Number(angle) * Math.PI) / 180;
    const dLat = toRad(Number(lat2) - Number(lat1));
    const dLon = toRad(Number(lon2) - Number(lon1));
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(Number(lat1))) * Math.cos(toRad(Number(lat2))) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
}

export function createGoogleMapsDirectionsUrl(originLat, originLng, destLat, destLng, destAddress = '', hospitalName = '') {
    const hasCoordinates = destLat != null && destLng != null &&
        Number.isFinite(Number(destLat)) && Number.isFinite(Number(destLng));
    const destinationQuery = hasCoordinates
        ? `${destLat},${destLng}`
        : [hospitalName, destAddress].filter(Boolean).join(', ');

    const mapsUrl = new URL('https://www.google.com/maps/dir/');
    mapsUrl.searchParams.set('api', '1');
    if (originLat != null && originLng != null) {
        mapsUrl.searchParams.set('origin', `${originLat},${originLng}`);
    }
    mapsUrl.searchParams.set('destination', destinationQuery);
    mapsUrl.searchParams.set('travelmode', 'driving');
    return mapsUrl.toString();
}

export function formatDistance(distanceKm) {
    if (distanceKm == null || !Number.isFinite(distanceKm)) return null;
    if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m away`;
    return `${distanceKm.toFixed(1)} km away`;
}

export function sanitizePhoneNumber(phone) {
    if (!phone) return null;
    // Keep numbers and leading plus sign
    const cleaned = phone.replace(/[^\d+]/g, '');
    return cleaned || null;
}
