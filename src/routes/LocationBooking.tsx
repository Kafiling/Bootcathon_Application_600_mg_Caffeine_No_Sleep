import React, { useEffect, useState, useRef } from "react";
import locationsData from "./location.json"; // Import locations.json

const LocationBooking = (): JSX.Element => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<{ lat: number, lng: number } | null>(null);
    const [searchValue, setSearchValue] = useState<string>('');
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    const [circle, setCircle] = useState<google.maps.Circle | null>(null);
    const circleRef = useRef<google.maps.Circle | null>(null);
    const [circleRadiusKm, setCircleRadiusKm] = useState<number>(10);
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
    const googleMapsApiKey = "AIzaSyB3rsm9TScsm2rfxmBzx_JwfN73EU1CHxY";
    const defaultLocation = { lat: 0, lng: 0 };

    useEffect(() => {
        const googleScript = document.createElement('script');
        googleScript.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places,geometry`;
        googleScript.async = true;
        googleScript.onload = initMap;
        document.body.appendChild(googleScript);

        return () => {
            document.body.removeChild(googleScript);
        };
    }, [googleMapsApiKey]);

    useEffect(() => {
        if (map && selectedPlace) {
            updateCircle(new window.google.maps.LatLng(selectedPlace.lat, selectedPlace.lng), circleRadiusKm * 1000);
        }
    }, [selectedPlace, circleRadiusKm]);

    const initMap = () => {
        const mapElement = document.getElementById('google-map');
        if (mapElement) {
            const mapOptions: google.maps.MapOptions = {
                center: defaultLocation,
                zoom: 8,
            };
            const newMap = new window.google.maps.Map(mapElement, mapOptions);
            setMap(newMap);

            fetchCurrentLocation(newMap);

            newMap.addListener("click", (event) => {
                const clickedLocation = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                };
                setSelectedPlace(clickedLocation);
                updateCircle(new window.google.maps.LatLng(clickedLocation.lat, clickedLocation.lng), circleRadiusKm * 1000);
            });

            const initialMarker = new window.google.maps.Marker({
                position: defaultLocation,
                map: newMap,
                title: 'Selected Location',
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    scaledSize: new window.google.maps.Size(32, 32),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(16, 32)
                }
            });
            setMarker(initialMarker);

            const initialCircle = new google.maps.Circle({
                strokeColor: "#4285F4",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#4285F4",
                fillOpacity: 0.35,
                map: newMap,
                center: defaultLocation,
                radius: circleRadiusKm * 1000
            });
            setCircle(initialCircle);
            circleRef.current = initialCircle;

            initialMarker.setPosition(defaultLocation);

            addMarkersInCircle(newMap, defaultLocation, circleRadiusKm);

            // Initialize Autocomplete
            const autocompleteInput = document.getElementById('autocomplete-input') as HTMLInputElement;
            const newAutocomplete = new window.google.maps.places.Autocomplete(autocompleteInput);
            setAutocomplete(newAutocomplete);

            newAutocomplete.addListener('place_changed', () => {
                const place = newAutocomplete.getPlace();
                if (!place.geometry) {
                    console.error('Place selection failed or no geometry available.');
                    return;
                }
                const selectedLocation = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };
                setSelectedPlace(selectedLocation);
                setSearchValue(place.formatted_address || '');
                newMap.setCenter(selectedLocation);
                updateCircle(new window.google.maps.LatLng(selectedLocation.lat, selectedLocation.lng), circleRadiusKm * 1000);
            });
        }
    };

    const fetchCurrentLocation = (map: google.maps.Map) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setSelectedPlace(currentLocation);
                map.setCenter(currentLocation);
                map.setZoom(15);
            }, () => {
                console.error("Error in fetching current location.");
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleSearch = () => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: searchValue }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const selectedLocation = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                };
                setSelectedPlace(selectedLocation);
                updateCircle(new window.google.maps.LatLng(selectedLocation.lat, selectedLocation.lng), circleRadiusKm * 1000);
            } else {
                console.error('Geocode was not successful for the following reason:', status);
            }
        });
    };

    const updateCircle = (center: google.maps.LatLng, radius: number) => {
        if (!map) return;

        if (!circleRef.current) {
            const circleOptions: google.maps.CircleOptions = {
                strokeColor: '#4285F4',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#4285F4',
                fillOpacity: 0.35,
                map: map,
                center: center,
                radius: radius,
            };

            const newCircle = new google.maps.Circle(circleOptions);
            setCircle(newCircle);
            circleRef.current = newCircle;
        } else {
            circleRef.current.setCenter(center);
            circleRef.current.setRadius(radius);
        }

        if (marker) {
            marker.setPosition(center.toJSON());
        }

        addMarkersInCircle(map, center.toJSON(), radius / 1000);
    };

    const addMarkersInCircle = (map: google.maps.Map, center: google.maps.LatLngLiteral, radiusKm: number) => {
        const newMarkers: google.maps.Marker[] = [];

        locationsData.Locations.forEach((location) => {
            const markerLatLng = new window.google.maps.LatLng(location.Latitude, location.Longitude);
            const isInCircle = isMarkerInCircle(location, center, radiusKm);

            let marker = markers.find(m => m.getPosition()?.equals(markerLatLng));

            if (isInCircle) {
                if (!marker) {
                    marker = new window.google.maps.Marker({
                        position: markerLatLng,
                        map: map,
                        title: location.LocationName,
                        icon: {
                            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                            scaledSize: new window.google.maps.Size(32, 32),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(16, 32)
                        }
                    });
                } else {
                    marker.setMap(map);
                }
                newMarkers.push(marker);
            } else {
                if (marker) {
                    marker.setMap(null);
                }
            }
        });

        setMarkers(newMarkers);
    };

    const isMarkerInCircle = (location: any, center: google.maps.LatLngLiteral, radiusKm: number) => {
        const markerLatLng = new window.google.maps.LatLng(location.Latitude, location.Longitude);
        const circleCenter = new window.google.maps.LatLng(center.lat, center.lng);
        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(markerLatLng, circleCenter);
        return distance <= radiusKm * 1000;
    };

    const handleRadiusInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        if (!isNaN(value)) {
            setCircleRadiusKm(value);
            if (selectedPlace) {
                updateCircle(new window.google.maps.LatLng(selectedPlace.lat, selectedPlace.lng), value * 1000);
            }
        }
    };

    return (
        <div>
            <header>
                <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                        <a href="" className="flex items-center">
                            <img src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/technician_invert.png" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Location for service</span>
                        </a>
                    </div>
                </nav>
            </header>
            <div style={{ height: '400px', width: '100%', marginBottom: '20px' }}>
                <div id="google-map" style={{ height: '100%', width: '100%' }}></div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <input
                    id="autocomplete-input"
                    type="text"
                    placeholder="Enter location..."
                    value={searchValue}
                    onChange={handleInputChange}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        width: '70%',
                        maxWidth: '400px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        marginRight: '10px'
                    }}
                />
                <button
                    type="button"
                    onClick={handleSearch}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#007BFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Search
                </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <label htmlFor="radius-input" style={{ marginRight: '10px' }}>Circle Radius (km):</label>
                <input
                    id="radius-input"
                    type="number"
                    value={circleRadiusKm}
                    onChange={handleRadiusInputChange}
                    min="1"
                    step="1"
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        width: '80px',
                        border: '1px solid #ccc',
                        borderRadius: '5px'
                    }}
                />
            </div>
            <div>
                {locationsData.Locations.map((location) => (
                    <div key={location.LocationID} style={{
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        padding: '10px',
                        margin: '10px 0',
                        maxWidth: '400px',
                        textAlign: 'left',
                        backgroundColor: '#f9f9f9'
                    }}>
                        <h3>{location.LocationName}</h3>
                        <p>{location.AddressLine1}, {location.AddressLine2}</p>
                        <p>{location.City}, {location.StateProvince} {location.PostalCode}</p>
                        <p>Telephone: {location.Telephone}</p>
                        <p>Weekly Operating Days: {location.WeeklyOperatingDays}</p>
                        <p>Weekly Operating Hours: {location.WeeklyOperatingHours}</p>
                        <p>Store Amenities: {location.StoreAmenities.join(', ')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LocationBooking;
