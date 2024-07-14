import React, { useEffect, useState } from "react";

const LocationBooking = (): JSX.Element => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<{ lat: number, lng: number } | null>(null);
    const [searchValue, setSearchValue] = useState<string>('');
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const googleMapsApiKey = "AIzaSyAcuB1_uyq5xydxn2janKo-pwpci7yT8dI"; // Your Google Maps API key
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
                // Add marker for current location
                const marker = new window.google.maps.Marker({
                    position: currentLocation,
                    map: map,
                    title: 'Your Location',
                    icon: {
                        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        scaledSize: new window.google.maps.Size(32, 32),
                        origin: new window.google.maps.Point(0, 0),
                        anchor: new window.google.maps.Point(16, 32)
                    }
                });
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
                if (map) {
                    map.setCenter(selectedLocation);
                    map.setZoom(15); // Example zoom level
                    // Add marker for selected place
                    const marker = new window.google.maps.Marker({
                        position: selectedLocation,
                        map: map,
                        title: place.name,
                        icon: {
                            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                            scaledSize: new window.google.maps.Size(32, 32),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(16, 32)
                        }
                    });
                }
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
                if (map) {
                    map.setCenter(selectedLocation);
                    map.setZoom(15); // Example zoom level
                    // Add marker for selected place
                    const marker = new window.google.maps.Marker({
                        position: selectedLocation,
                        map: map,
                        title: results[0].formatted_address,
                        icon: {
                            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                            scaledSize: new window.google.maps.Size(32, 32),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(16, 32)
                        }
                    });
                }
            } else {
                console.error('Geocode was not successful for the following reason:', status);
            }
        });
    };

    useEffect(() => {
        // Update map location when selectedPlace changes
        if (map && selectedPlace) {
            map.setCenter(selectedPlace);
            map.setZoom(15); // Example zoom level
        }
    }, [map, selectedPlace]);

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
        </div>
    );
};

export default LocationBooking;
