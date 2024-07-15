import React, {FunctionComponent,useState} from 'react'
import GoogleMapReact from 'google-map-react';
import "./output.css"
import closestLocations from '../components/Locator';"../components/Locator";
function FindNearest() {
    const [location, setLocation] = useState(null);
    
    function currentLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(success, error);
        } else {
          console.log("Geolocation not supported");
        }
      }
      
      function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLocation({ latitude, longitude });
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      }
    
      function error() {
        console.log("Unable to retrieve your location");
      }

      window.onload = currentLocation;
      
    
      return (
        <>
        <header>
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <a href="" className="flex items-center">
            
                        <img src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/technician_invert.png" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Nearest Locations</span>
                    </a>

                </div>
            </nav>
        </header>

            <section className='mx-6 my-6'>
                
                <div className="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-stone-50 dark:bg-stone-50 shadow-xl" role="alert">
                <div className="flex items-center">
                    <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Info</span>
                    <h3 className="text-lg font-medium">{closestLocations[0].LocationName} </h3>
                </div>
                <div className="mt-2 mb-4 text-sm">
                    More info about this info alert goes here. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.
                </div>
                </div>

                <div className="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-stone-50 dark:bg-stone-50 shadow-xl" role="alert">
                <div className="flex items-center">
                    <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Info</span>
                    <h3 className="text-lg font-medium">{closestLocations[1].LocationName}</h3>
                </div>
                <div className="mt-2 mb-4 text-sm">
                    More info about this info alert goes here. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.
                </div>
                </div>

                <div className="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-stone-50 dark:bg-stone-50 shadow-xl" role="alert">
                <div className="flex items-center">
                    <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Info</span>
                    <h3 className="text-lg font-medium">{closestLocations[2].LocationName}</h3>
                </div>
                <div className="mt-2 mb-4 text-sm">
                    More info about this info alert goes here. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.
                </div>
                </div>

                <div className="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-stone-50 dark:bg-stone-50 shadow-xl" role="alert">
                <div className="flex items-center">
                    <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Info</span>
                    <h3 className="text-lg font-medium">{closestLocations[3].LocationName}</h3>
                </div>
                <div className="mt-2 mb-4 text-sm">
                    More info about this info alert goes here. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.
                </div>
                </div>

                <div className="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-stone-50 dark:bg-stone-50 shadow-xl" role="alert">
                <div className="flex items-center">
                    <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Info</span>
                    <h3 className="text-lg font-medium">{closestLocations[4].LocationName}</h3>
                </div>
                <div className="mt-2 mb-4 text-sm">
                    More info about this info alert goes here. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.
                </div>
                </div>
                
               
               
            </section>
            
        </>
    )
}
export default FindNearest