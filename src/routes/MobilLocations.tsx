import React, {FunctionComponent, useState, useRef} from 'react'
import GoogleMapReact from 'google-map-react';
import { useNavigate } from "react-router-dom";
import "./output.css"
import {setDefaults,fromLatLng,setKey,geocode,RequestType} from "react-geocode";
import mobillocations from "../location.json";


function MobilLocations() { 
    setKey(import.meta.env.VITE_GOOGLE_MAPS_API_KEY); // Your API key here.
    const navigate = useNavigate();
    function handleClick() {
        navigate("/findnearest");
    }

    const defaultProps = {
        //Cord of Bangkok ,unused saved for future use
        center: {
          lat: 13.736717,
          lng: 100.523186
        },
        zoom: 8
      };
    
    type AnyReactComponentProps = {
    lat: number | undefined;
    lng: number | undefined;
    text: string;
    };
    //const AnyReactComponent: FunctionComponent<AnyReactComponentProps> = ({ lat, lng, text }) => <><button onClick={getAddress} type="button" className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 right-14 relative">Select Location</button><img src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/location-pin.png" className="h-6 sm:h-9" alt="Flowbite Logo" /></>;
    const [userLocation, setUserLocation] = useState<{ latitude: any, longitude: any }>({ latitude: 13.736717, longitude: 100.523186 });

    const getUserLocation = () => {
        // if geolocation is supported by the users browser
        if (navigator.geolocation) {
          // get the current users location
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // save the geolocation coordinates in two variables
              const { latitude, longitude } = position.coords;
              // update the value of userlocation variable
              setUserLocation({ latitude, longitude });
            },
            // if there was an error getting the users location
            (error) => {
              console.error('Error getting user location:', error);
              setUserLocation({ latitude: 13.736717, longitude: 100.523186 })
            }
          );
        }
        // if geolocation is not supported by the users browser
        else {
          console.error('Geolocation is not supported by this browser.');
          setUserLocation({ latitude: 13.736717, longitude: 100.523186 })
        }
      };
    
      // Get formatted address, city, state, country from latitude & longitude.
    
      //set interval to get user location
      const getAddress = () =>{
       if (userLocation) {
          geocode(RequestType.LATLNG, `${userLocation.latitude},${userLocation.longitude}`, {
            location_type: "ROOFTOP", // Override location type filter for this request.
            enable_address_descriptor: true, // Include address descriptor in response.
          })
            .then(({ results }) => {
              const address = results[0].formatted_address;
              const { city, state, country } = results[0].address_components.reduce(
                (acc, component) => {
                  if (component.types.includes("locality"))
                    acc.city = component.long_name;
                  else if (component.types.includes("administrative_area_level_1"))
                    acc.state = component.long_name;
                  else if (component.types.includes("country"))
                    acc.country = component.long_name;
                  return acc;
                },
                {}
              );
              console.log(city, state, country);
              console.log(address);
            })
            .catch(console.error);
        }
        else { console.log("No user location found") }
      }
      
      const handleApiLoaded = (map, maps) => {
        // use map and maps objects
        map.setOptions({ gestureHandling: "greedy" });
        setInterval(() => {
          const center = map.getCenter()
          let lat = center.lat(); 
          let lag = center.lng();
          console.log(lat);
          setUserLocation({ latitude: lat, longitude: lag });
          
        }, 2000);
        console.log(mobillocations.Locations[0].Latitude);
      };
      
      
     



    return (
        <>
        <header>
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <a href="" className="flex items-center">
            
                        <img src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/technician_invert.png" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Mobil 1 Center</span>
                    </a>

                </div>
            </nav>
        </header>

            <section>
                <div className="flex justify-center items-center mx-4 my-4 rounded-xl"> {/* Centered content */}
                <div style={{ height: '80vh', width: '100%' }}>
                
                <GoogleMapReact
                    yesIWantToUseGoogleMapApiInternals = {true}
                    bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY }}
                    defaultCenter={userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : { lat: defaultProps.center.lat, lng: defaultProps.center.lng }}
                    defaultZoom={defaultProps.zoom}
                    onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                >
                    {mobillocations.Locations.map(item => {
                        return (
                        <div lat={item.Latitude} lng={item.Longitude}>
                            <img className='h-6' src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/location-pin.png" alt="pin" />
                        </div>
                        );
                    })}
    
                </GoogleMapReact>
                </div>      

                    <div className="flex justify-center fixed bottom-6 w-full"> {/* Centered button */}
                        <button type="button" className="text-white bg-red-700 font-bold rounded-full text-2xl px-5 py-2.5 text-center me-2 mb-2 focus:animate-spin w-3/5" onClick={handleClick}>Find Nearest</button>
                    </div>
                </div>
            </section>
            
        </>
    )
}
export default MobilLocations