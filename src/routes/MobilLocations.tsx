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
        //Hard coding KX Building coordinates
        center: {
          lat: 13.720489856793682717,
          lng: 100.4983042514412723186
        },
        zoom: 10
      };
    ;
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
                    defaultCenter={{ lat: defaultProps.center.lat, lng: defaultProps.center.lng }}
                    defaultZoom={defaultProps.zoom}
                    
                >
                    {mobillocations.Locations.map(item => {
                        return (
 
                        <div lat={item.Latitude} lng={item.Longitude}>
                            <img className='h-6' src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/location-pin.png" alt="pin" />
                        </div>

                        
                        );
                    })}

                    <div lat={defaultProps.center.lat} lng={defaultProps.center.lng}>
                            <img className='h-6' src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/map.png" alt="currentpin" />
                    </div>
    
                </GoogleMapReact>
                </div>         
                </div>
                <div className="flex justify-center fixed bottom-0 w-full"> {/* Centered button */}
                        <button type="button" className="text-white bg-red-700 font-bold rounded-full text-2xl px-5 py-2.5 text-center me-2 mb-2 w-3/5" onClick={handleClick}>Find Nearest</button>
                    </div>
            </section>
            
        </>
    )
}
export default MobilLocations