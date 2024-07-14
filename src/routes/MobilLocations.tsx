import React, {useState, useRef} from 'react'
import GoogleMapReact from 'google-map-react';
import { useNavigate } from "react-router-dom";
import useSupercluster from "use-supercluster";
import useSwr from "swr";
import "./output.css"

const fetcher = (...args) => fetch(...args).then(response => response.json());

const Marker = ({children}) => children;

function MobilLocations() { 
    const navigate = useNavigate();
    function handleClick() {
        navigate("/findnearest");
    }

    const mapRef = useRef();
    const [zoom, setZoom] = useState(8);
    const [bounds, setBounds] = useState(null);

    const url =
    "https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2024-04";
    const { data, error } = useSwr(url, { fetcher });
    const shops = data && !error ? data.slice(0, 500) : []; //slice =  numbers of shops to display

    

    
    const defaultProps = {
        //Cord of Bangkok ,unused saved for future use
        center: {
          lat: 52.6376,
          lng: -1.135171
        },
        zoom: 8
      };
      
    const [userLocation, setUserLocation] = useState<{ latitude: number ; longitude: number  } | null>(null);

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
                    bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY}} /*TODO : Add Google Map API Key to .env file 8*/
                    defaultCenter={userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : { lat: 52.6376, lng: -1.135171 }}
                    defaultZoom={defaultProps.zoom}
                >
                    {shops.map(shop => (
                    <Marker key={shop.id} lat={shop.location.latitude} lng={shop.location.longitude} >
                        <button className="bg-none border-none">
                        <img className = "h-6 w-6"src="../images/custody.svg" alt="Crime Icon" />
                        </button>
                    </Marker>
                    ))}
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