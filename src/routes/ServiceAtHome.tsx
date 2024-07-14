import React, {FunctionComponent,useState} from 'react'
import GoogleMapReact from 'google-map-react';
import {setDefaults,fromLatLng,setKey,geocode,RequestType} from "react-geocode";

// Set default response language and region (optional).
// This sets default values for language and region for geocoding requests.


import "./output.css"
function ServiceAtHome() {
  setKey(import.meta.env.VITE_GOOGLE_MAPS_API_KEY); // Your API key here.
  
    const defaultProps = {
        //Cord of Bangkok ,unused saved for future use
        center: {
          lat: 13.736717,
          lng: 100.523186
        },
        zoom: 9
      };
      type AnyReactComponentProps = {
        lat: number | undefined;
        lng: number | undefined;
        text: string;
      };
      
      
      const AnyReactComponent: FunctionComponent<AnyReactComponentProps> = ({ lat, lng, text }) => <><button onClick={getAddress} type="button" className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 right-14 relative">Select Location</button><img src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/location-pin.png" className="h-6 sm:h-9" alt="Flowbite Logo" /></>;
      const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number }>({ latitude: 13.736717, longitude: 100.523186 });

      // define the function that finds the users geolocation
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

  
  

  
 

  return (
    <>
    <header>
    <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="" className="flex items-center">
            
                <img src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/technician_invert.png" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Mobil Demo</span>
            </a>

        </div>
    </nav>
</header>
<section>
    <div className='bg-red-500'>Service-at-Home</div>
    <div style={{ height: '30vh', width: '100%' }}>
    {/*TODO : Add Google Map API Key to .env file */}
      <GoogleMapReact
        bootstrapURLKeys={{ key: "" }}
        defaultCenter={userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : { lat: 13.736717, lng: 100.523186 }}
        defaultZoom={defaultProps.zoom}
        //onClick={setUserLocation()}
      >
        <AnyReactComponent
          
          //add image 
          text="My Marker"
        />
      </GoogleMapReact>
    </div>
</section>
    
    </>
  )
}

export default ServiceAtHome