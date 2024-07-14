import React from "react";
import {APIProvider, Map, MapCameraChangedEvent} from '@vis.gl/react-google-maps';
import "./output.css"

function MobilLocations() {
    return (
        <>
            <header >
                <nav className="bg-white border-gray-200 p-4 dark:bg-gray-800 h-1/6">
                    <div className="flex flex-wrap justify-between items-center mx-auto my-8 max-w-screen-xl">
                        <a href="https://www.mobil.co.th/th-th/our-products/mobil-1" className="flex items-center">    {/*Logo*/}
                            <img src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/map.png" className="mr-3 h-14 sm:h-9" alt="Location Logo" />
                            <span className="self-center text-4xl font-extrabold whitespace-nowrap dark:text-white mx-auto">Mobil 1 Center</span>
                        </a>
                        <img src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/profile.png" className="mr-3 h-10 sm:h-9 float-right" alt="Account Profile" />
                    </div>
                </nav>

                

                
            </header>
            
            <section>
                
                <div style={{height: '60vh' , width: '100%'}}>
                <APIProvider apiKey={'YOUR API HERE'} onLoad={() => console.log('Maps API has loaded.')}>
                <Map
                defaultZoom={13}
                defaultCenter={ { lat: -33.860664, lng: 151.208138 } }
                onCameraChanged={ (ev: MapCameraChangedEvent) =>
                console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                }>
                </Map>
                </APIProvider>
                </div>

                <div className="flex justify-center fixed bottom-10 w-full "> {/* Centered button */}
                    <button type="button" className="text-white bg-red-700 font-bold rounded-full text-2xl px-5 py-2.5 text-center me-2 mb-2 focus:animate-spin w-3/5">Find Nearest</button>
                </div>
                

            </section>
        </>
    )
}
export default MobilLocations