import locations from '../location.json';

// Default location coordinates
const defaultLocation = {
    latitude: 13.720594083587173,
    longitude: 100.49852955698758
};

// Function to calculate the distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}

// Function to convert degrees to radians
function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

// Function to find the 5 closest locations
function findClosestLocations(): Location[] {
    const sortedLocations = locations.Locations.sort((a, b) => {
        const distanceA = calculateDistance(defaultLocation.latitude, defaultLocation.longitude, a.Latitude, a.Longitude);
        const distanceB = calculateDistance(defaultLocation.latitude, defaultLocation.longitude, b.Latitude, a.Longitude);
        return distanceA - distanceB;
    });

    return sortedLocations.slice(0, 5);
}

// Usage
const closestLocations = findClosestLocations();
export default closestLocations;