import React, {FunctionComponent,useState} from 'react'
import GoogleMapReact from 'google-map-react';


import "./output.css"
function ServiceAtHome() {
    const defaultProps = {
        //Cord of Bankkok ,unused saved for future use
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
      
      const AnyReactComponent: FunctionComponent<AnyReactComponentProps> = ({ lat, lng, text }) => <img src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/location-pin.png" className="h-6 sm:h-9" alt="Flowbite Logo" />;
      const [userLocation, setUserLocation] = useState<{ latitude: number ; longitude: number  } | null>(null);

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
    {/*TODO : Add Google Map API Key to .env file 8*/}
      <GoogleMapReact
        bootstrapURLKeys={{ key: "" }}
        defaultCenter={userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : { lat: 13.736717, lng: 100.523186 }}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={userLocation?.latitude}
          lng={userLocation?.longitude}
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




