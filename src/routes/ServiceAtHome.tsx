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
  };
  
  
 

  return (
    <>
    <header>
    <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="" className="flex items-center">
            
                <img src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/technician_invert.png" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                <span className="self-center text-xl  whitespace-nowrap text-white ">Mobil@Home</span>
            </a>

        </div>
    </nav>
</header>
<section className='px-4'>
  <h2 className="text-2xl text-red-600">บริการถึงใจ ใส่ใจถึงหน้าบ้านคุณ</h2>
  <p className="my-4 text-lg text-gray-500">📍 เลือกตำแหน่งที่ต้องการรับบริการ</p>
    <div style={{ height: '30vh', width: '100%'}}>
    {/*TODO : Add Google Map API Key to .env file */}
      <GoogleMapReact
        yesIWantToUseGoogleMapApiInternals = {true}
        bootstrapURLKeys={{ key: "" }}
        defaultCenter={userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : { lat: 13.736717, lng: 100.523186 }}
        defaultZoom={defaultProps.zoom}
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        <AnyReactComponent
          
          //add image 
          text="My Marker"
        />
      </GoogleMapReact>
    </div>
    <p className="my-4 text-lg text-black">ข้อมูลผู้ใช้บริการสำหรับติดต่อช่าง 🏷</p>
    <form>
    <div class="grid gap-6 mb-6 md:grid-cols-2 pt-4">
        <div>
            <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 ">First name</label>
            <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="John" required />
        </div>
        <div>
            <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 ">Last name</label>
            <input type="text" id="last_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Doe" required />
        </div>
        <div>
            <label for="company" class="block mb-2 text-sm font-medium text-gray-900 ">Company</label>
            <input type="text" id="company" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Flowbite" required />
        </div>  
        <div>
            <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 ">Phone number</label>
            <input type="tel" id="phone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="123-45-678" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" required />
        </div>
        <div>
            <label for="website" class="block mb-2 text-sm font-medium text-gray-900 ">Website URL</label>
            <input type="url" id="website" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="flowbite.com" required />
        </div>
        <div>
            <label for="visitors" class="block mb-2 text-sm font-medium text-gray-900 ">Unique visitors (per month)</label>
            <input type="number" id="visitors" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="" required />
        </div>
    </div>
    <div class="mb-6">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Email address</label>
        <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="john.doe@company.com" required />
    </div> 
    <div class="mb-6">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
        <input type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="•••••••••" required />
    </div> 
    <div class="mb-6">
        <label for="confirm_password" class="block mb-2 text-sm font-medium text-gray-900 ">Confirm password</label>
        <input type="password" id="confirm_password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="•••••••••" required />
    </div> 
    <div class="flex items-start mb-6">
        <div class="flex items-center h-5">
        <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required />
        </div>
        <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" class="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a>.</label>
    </div>
    <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
</form>
</section>
    
    </>
  )
}

export default ServiceAtHome