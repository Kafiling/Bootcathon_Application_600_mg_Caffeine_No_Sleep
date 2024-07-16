import React, { useEffect, useState, useRef } from 'react';
import locationsData from './location.json'; // Import locations.json
import swal from 'sweetalert';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const LocationBooking = (): JSX.Element => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<{ lat: number, lng: number } | null>(null);
    const [clickedLocation, setClickedLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [searchValue, setSearchValue] = useState<string>('');
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    const [circle, setCircle] = useState<google.maps.Circle | null>(null);
    const circleRef = useRef<google.maps.Circle | null>(null);
    const [circleRadiusKm, setCircleRadiusKm] = useState<number>(10);
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
    const [mapCenter, setMapCenter] = useState<{ lat: number, lng: number }>({ lat: 0, lng: 0 });
    const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false); // State to manage modal open/close
    const [bookingLocation, setBookingLocation] = useState<string>(''); // State to store booking location name
    const [bookingDate, setBookingDate] = useState<Date | null>(null); // State to store selected booking date/time

    const googleMapsApiKey = "api"; // Replace with your Google Maps API key
    const defaultLocation = { lat: 0, lng: 0 };

    useEffect(() => {
        const googleScript = document.createElement('script');
        googleScript.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places,geometry`;
        googleScript.async = true;
        googleScript.onload = initMap;
        googleScript.onerror = () => {
            console.error("Error loading Google Maps script");
        };
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

    useEffect(() => {
        if (map && clickedLocation) {
            // Update the map to show a temporary marker or highlight effect for clickedLocation
            const clickedMarker = new google.maps.Marker({
                position: clickedLocation,
                map: map,
                title: 'Clicked Location',
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Adjust icon as needed
                    scaledSize: new window.google.maps.Size(32, 32),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(16, 32)
                }
            });

            // Center map on clicked location
            map.setCenter(clickedLocation);
            setMapCenter(clickedLocation);

            // Optionally, you can set a timeout to remove the temporary marker or highlight effect
            setTimeout(() => {
                clickedMarker.setMap(null);
            }, 3000); // Remove marker after 3 seconds
        }
    }, [clickedLocation, map]);

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
                setMapCenter(selectedLocation);
                updateCircle(new window.google.maps.LatLng(selectedLocation.lat, selectedLocation.lng), circleRadiusKm * 1000);
            });
        } else {
            console.error("Map element not found");
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
                setMapCenter(currentLocation);
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
                setMapCenter(selectedLocation);
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

    const handleBookingClick = (location: any) => {
        setBookingLocation(location.LocationName); // Store booking location name
        setBookingModalOpen(true); // Open booking modal
    };

    const handleLocationBoxClick = (location: any) => {
        const clickedLocation = {
            lat: location.Latitude,
            lng: location.Longitude
        };
        setClickedLocation(clickedLocation);
    };

    const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCircleRadiusKm(Number(event.target.value));
    };

    const filteredLocations = locationsData.Locations.filter(location => {
        if (!selectedPlace) return false;
        return isMarkerInCircle(location, selectedPlace, circleRadiusKm);
    });

    const handleBookingConfirm = () => {
        // Implement booking confirmation logic here
        if (bookingDate) {
            swal("Booking Confirmed!", `You have successfully booked ${bookingLocation} on ${bookingDate.toLocaleString()}`, "success");
        } else {
            swal("Please select a date and time!", "You must select a date and time to confirm your booking.", "warning");
        }
        setBookingModalOpen(false); // Close booking modal after confirmation
    };

    const setTimeForDatePicker = (hours: number, minutes: number): Date => {
        const today = new Date();
        const selectedTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
        return selectedTime;
    };

    const isDateValid = (date: Date): boolean => {
        const minTime = new Date();
        minTime.setHours(8, 0, 0, 0); // Minimum time 8:00 AM
        const maxTime = new Date();
        maxTime.setHours(17, 0, 0, 0); // Maximum time 5:00 PM

        // Compare the selected date with the current date and time
        return date >= minTime && date <= maxTime;
    };

    return (
        <div>
            <header>
                <nav className="bg-gray-800 border-gray-800 px-4 lg:px-6 py-2.5 dark:bg-gray-900 dark:border-gray-900">
                    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                        <a href="#" className="flex items-center">
                            <img src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/technician_invert.png" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Location for service</span>
                        </a>
                    </div>
                </nav>
            </header>
            <div style={{ height: '350px', width: '100%', marginBottom: '20px' }}>
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
                <label htmlFor="radius-input" className="mr-2">Circle Radius (km):</label>
                <input
                    id="radius-input"
                    type="range"
                    value={circleRadiusKm}
                    onChange={handleRadiusInputChange}
                    min="1"
                    max="50" // Adjust the max value as needed
                    step="1"
                    className="slider appearance-none w-80 bg-gray-200 h-1 rounded outline-none focus:outline-none focus:bg-gray-300 transition-all duration-300 ease-in-out"
                />
                <span className="ml-2">{circleRadiusKm} km</span>
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
            <div className="flex justify-center">
                <div>
                    {filteredLocations.map((location) => (
                        <div
                            key={location.LocationID}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                padding: '10px',
                                margin: '10px 0',
                                maxWidth: '400px',
                                textAlign: 'left',
                                backgroundColor: '#f9f9f9',
                                cursor: 'pointer' // Add cursor pointer for click effect
                            }}
                            onClick={() => handleLocationBoxClick(location)}
                        >
                            <h3>{location.LocationName}</h3>
                            <p>{location.AddressLine1}, {location.AddressLine2}</p>
                            <p>{location.City}, {location.StateProvince} {location.PostalCode}</p>
                            <p>- Telephone: {location.Telephone}</p>
                            <p>- Operating Days: {location.WeeklyOperatingHours}</p>
                            <div style={{ display: 'inline-block' }}>
                                <p style={{ display: 'inline' }}>- Opening Hours: </p>
                                <ul style={{ display: 'inline', padding: 0, margin: 0 }}>
                                    {location.HoursOfOperation24.map((hours, index) => (
                                        <li key={index} style={{ display: 'inline', marginRight: '10px' }}>
                                            {hours.day}: {hours.hours}{index !== location.HoursOfOperation24.length - 1 && ', '}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${location.LocationName}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        marginLeft: '0',
                                        padding: '10px 20px',
                                        fontSize: '16px',
                                        backgroundColor: '#007BFF',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        marginTop: '10px',
                                        textDecoration: 'none'
                                    }}
                                >
                                    View on Google Maps
                                </a>
                                <button
                                    type="button"
                                    onClick={() => handleBookingClick(location.LocationName)}
                                    style={{
                                        padding: '10px 20px',
                                        fontSize: '16px',
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        marginTop: '10px'
                                    }}
                                >
                                    Book now
                                </button>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
            {/* Booking Modal */}
            {bookingModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-lg font-medium mb-4">Select date and time for booking at {bookingLocation}</h3>
                        <DatePicker
                            selected={bookingDate}
                            onChange={(date: Date | null) => setBookingDate(date)}
                            showTimeSelect
                            timeIntervals={60}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4 focus:outline-none"
                            minDate={new Date()} // Set minimum date to current date
                            minTime={new Date().setHours(8, 0, 0)} // Set minimum time to 8:00 AM
                            maxTime={new Date().setHours(17, 0, 0)} // Set maximum time to 5:00 PM (17:00)
                        />


                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none"
                                onClick={handleBookingConfirm}
                            >
                                Confirm Booking
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-200 text-gray-700 ml-4 rounded-lg focus:outline-none"
                                onClick={() => setBookingModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default LocationBooking;
