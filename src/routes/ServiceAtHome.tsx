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
          document.getElementById("address").value = address;
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
  <h2 className="text-2xl text-red-600 pt-2">บริการถึงใจ ใส่ใจถึงหน้าบ้านคุณ</h2>
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
    
    <form >
    <div className="grid gap-6 mb-6 grid-cols-2 pt-4">
      <div className="col-span-2">
            <label for="address" className="block mb-2 text-sm font-medium text-gray-900 ">สถานที่นัดรับบริการ*
            </label>
            <textarea  rows={4} id="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder='กรุณากด "Select Location" เพื่อเลือกสถานที่นัดรับบริการ' required />
        </div>
        <p className="my-4 text-lg text-black col-span-2">ข้อมูลผู้ใช้บริการสำหรับติดต่อช่าง 🧑‍🔧</p>
        <div>
            <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 ">ชื่อจริง*
            </label>
            <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="เอ็กซอน" required />
        </div>
        <div>
            <label for="last_name" className="block mb-2 text-sm font-medium text-gray-900 ">นามสกุล*</label>
            <input type="text" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="โมบิล" required />
        </div>
        <div>
            <label for="tel" className="block mb-2 text-sm font-medium text-gray-900 ">เบอร์โทรศัพท์*</label>
            <input type="tel" id="phone" name="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="เบอร์โทรศัพท์" required />
        </div>  
        <p className="my-4 text-lg text-black col-span-2">วันและเวลาที่ต้องการใช้บริการ 📅</p>
        <div class="relative max-w-sm col-span-2">
  <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none ">
    <svg class="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
    </svg>
  </div>
  <input  id="default-datepicker" type="datetime-local" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 " placeholder="Select date"/ >
</div>
<p className="my-4 text-lg text-black col-span-2">รถที่เข้าใช้บริการ 🚘</p>
<div className="col-span-2">
  <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
    <option selected>เลือกยี่ห้อรถที่ใช้บริการ*</option>
    <option value="Toyota">Toyota</option>
    <option value="Honda">Honda</option>
    <option value="Mitsubishi">Mitsubishi</option>
  </select>
</div>
<div className="col-span-2">
    <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 ">รุ่นรถยนต์*
    </label>
    <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="กรุณาใส่ชื่อรุ่นรถยนต์ของท่าน" required />
</div>

<p className="my-4 text-lg text-black col-span-2">เลือกบริการที่ต้องการ 🔧</p>   
<img className="w-full h-auto col-span-2 " src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/Services.png  " alt="image description"></img>
<p className="my-4 text-lg text-black col-span-2">โปรดเลือกอย่างน้อย 1 บริการ </p> 
<div class="flex items-center  col-span-2">
    <input id="default-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "/>
    <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 ">บริการตรวจเช็คสภาพรถเบื้องต้น</label>
</div>  
<div class="flex items-center  col-span-2">
    <input id="default-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "/>
    <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 ">บริการเปลี่ยนถ่ายน้ำมันเครื่อง Mobil 1</label>
</div> 
<div class="flex items-center  col-span-2">
    <input id="default-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "/>
    <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 ">บริการซ่อมแซมระบบปรับอากาศภายใน</label>
</div> 
<div class="flex items-center  col-span-2">
    <input id="default-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "/>
    <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 ">บริการเปลี่ยนระบบโช๊ค</label>
</div> 
<div class="flex items-center  col-span-2">
    <input id="default-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "/>
    <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 ">บริการเปลี่ยนยางและล้อ</label>
</div> 
<div class="flex items-center  col-span-2">
    <input id="default-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "/>
    <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 ">บริการเปลี่ยนแบตเตอรี่และตรวจเช็คระบบไฟฟ้า</label>
</div> 
<div class="flex items-center  col-span-2">
    <input id="default-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "/>
    <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 ">บริการอื่น ๆ โปรดสอบถามทางช่างเพิ่มเติม</label>
</div> 
<div className="col-span-2">
    <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 ">คูปอง/โค้ดโปรโมชั่น
    </label>
    <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder=""/>
</div>
    
    <button onClick={() => location.replace("/at-home-confirm")}  type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center col-span-2">Submit</button>
    
    </div>
    </form>

</section>
    

    </>
  )
}

export default ServiceAtHome