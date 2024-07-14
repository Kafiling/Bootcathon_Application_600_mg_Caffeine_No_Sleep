import React, { useEffect, useState, useRef } from "react";
import locationsData from "./location.json"; // Import locations.json

const LocationBooking = (): JSX.Element => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<{ lat: number, lng: number } | null>(null);
    const [searchValue, setSearchValue] = useState<string>('');
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    const circleRef = useRef<google.maps.Circle | null>(null);
    const [circleRadiusKm, setCircleRadiusKm] = useState<number>(10); // Initial radius in kilometers
    const googleMapsApiKey = "api";
    const defaultLocation = { lat: 0, lng: 0 }; // Default to center of the world

    useEffect(() => {
        // Load Google Maps Places API script
        const googleScript = document.createElement('script');
        googleScript.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
        googleScript.async = true;
        googleScript.onload = initMap;
        document.body.appendChild(googleScript);

        return () => {
            document.body.removeChild(googleScript);
        };
    }, [googleMapsApiKey]);

    useEffect(() => {
        if (map && selectedPlace) {
            updateCircle(new window.google.maps.LatLng(selectedPlace.lat, selectedPlace.lng), circleRadiusKm * 1000); // Convert km to meters
        }
    }, [selectedPlace, circleRadiusKm]);

    const initMap = () => {
        // Initialize the map
        const mapElement = document.getElementById('google-map');
        if (mapElement) {
            const mapOptions: google.maps.MapOptions = {
                center: defaultLocation,
                zoom: 8,
            };
            const newMap = new window.google.maps.Map(mapElement, mapOptions);
            setMap(newMap);

            // Initialize Autocomplete
            const autocompleteInstance = new window.google.maps.places.Autocomplete(
                document.getElementById("autocomplete-input") as HTMLInputElement
            );
            autocompleteInstance.setFields(['geometry']);
            autocompleteInstance.addListener("place_changed", handlePlaceSelect);
            setAutocomplete(autocompleteInstance);

            // Fetch and set current location as default
            fetchCurrentLocation(newMap);

            // Add markers for each location in locationsData
            if (Array.isArray(locationsData.Locations)) {
                locationsData.Locations.forEach((location) => {
                    new window.google.maps.Marker({
                        position: { lat: location.Latitude, lng: location.Longitude },
                        map: newMap,
                        title: location.LocationName,
                        icon: {
                            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // Red pointer icon
                            scaledSize: new window.google.maps.Size(32, 32),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(16, 32)
                        }
                    });
                });
            }

            // Initialize marker for selected place
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

            // Add click event listener to set selected place
            newMap.addListener("click", (event) => {
                const clickedLocation = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                };
                setSelectedPlace(clickedLocation);
                initialMarker.setPosition(clickedLocation);
                initialMarker.setTitle('Selected Location');
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
                map.setZoom(15); // Example zoom level
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

    const handlePlaceSelect = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const selectedLocation = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };
                setSelectedPlace(selectedLocation);
                setSearchValue(place.formatted_address); // Set input value to selected place address
            }
        }
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
            } else {
                console.error('Geocode was not successful for the following reason:', status);
            }
        });
    };

    const updateCircle = (center: google.maps.LatLng, radius: number) => {
        if (!map) return;

        if (!circleRef.current) {
            // Create new circle if it doesn't exist
            const circleOptions: google.maps.CircleOptions = {
                strokeColor: '#007BFF',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#007BFF',
                fillOpacity: 0.35,
                map: map,
                center: center,
                radius: radius, // Radius in meters
            };

            const newCircle = new google.maps.Circle(circleOptions);
            circleRef.current = newCircle;
        } else {
            // Update existing circle
            circleRef.current.setCenter(center);
            circleRef.current.setRadius(radius);
        }

        // Update marker position to center of the circle
        if (marker) {
            marker.setPosition(center.toJSON()); // Center marker on the circle
        }
    };

    const handleRadiusInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        if (!isNaN(value)) {
            setCircleRadiusKm(value);
            if (selectedPlace) {
                updateCircle(new window.google.maps.LatLng(selectedPlace.lat, selectedPlace.lng), value * 1000); // Convert km to meters
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
                        width: '80%',
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
        </div>
    );
};

export default LocationBooking;
