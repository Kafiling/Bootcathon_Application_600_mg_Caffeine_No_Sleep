import React from "react";
import "./output.css"
function MobilLocations() {
    return (
        <>
            <header className="h-screen">
                <nav className="bg-white border-gray-200 p-4 dark:bg-gray-800 h-1/6">
                    <div className="flex flex-wrap justify-between items-center mx-auto my-8 max-w-screen-xl">
                        <a href="https://flowbite.com" className="flex items-center">    {/*Logo*/}
                            <img src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/map.png" className="mr-3 h-14 sm:h-9" alt="Location Logo" />
                            <span className="self-center text-4xl font-extrabold whitespace-nowrap dark:text-white mx-auto">Mobil 1 Center</span>
                        </a>
                        <img src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/profile.png" className="mr-3 h-10 sm:h-9 float-right" alt="Account Profile" />
                    </div>
                </nav>
                
                <div className="flex justify-center fixed bottom-10 w-full "> {/* Centered button */}
                    <button type="button" className="text-white bg-red-700 font-bold rounded-full text-2xl px-5 py-2.5 text-center me-2 mb-2 focus:animate-spin w-3/5">Find Nearest</button>
                </div>
            </header>
        </>
    )
}
export default MobilLocations