// lib/validateAddress.js
export const validateAddress = async (address) => {
    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${address}&limit=1`);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
        const { coordinates } = data.features[0].geometry;
        const parisCoordinates = [2.3522, 48.8566]; // Longitude, Latitude of Paris
        const distance = getDistanceFromLatLonInKm(parisCoordinates[1], parisCoordinates[0], coordinates[1], coordinates[0]);

        return distance <= 50; // Return true if within 50 km
    }

    return false; // Invalid address
};

// Helper function to calculate distance
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};
