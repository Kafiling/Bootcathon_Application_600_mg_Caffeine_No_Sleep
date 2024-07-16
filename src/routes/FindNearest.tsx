import { useNavigate } from "react-router-dom";
import "./output.css"
import closestLocations from '../components/Locator';"../components/Locator";

function FindNearest() {

    const navigate = useNavigate();
    function handleClick() {
        navigate("/locations");
    }
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

            <section className='mx-4 my-4'> 
                <div className="relative justify-center items-center h-auto bg-gray-100 rounded-2xl">
                <div className='px-2.5 py-3.5'>
                {closestLocations.map(location => {
                        return (
                        <>
                        <div className="p-4 mb-4 text-black border border-blue-300 rounded-lg bg-stone-50 dark:bg-stone-50 shadow-xl" role="alert">
                        <div className="flex items-center text-blue-800 ">
                            <img className = "h-6" src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/map.png" alt="Logo" />
                            <span className="sr-only">Info</span>
                            <h3 className="text-lg font-semibold ml-5">{location.DisplayName} </h3>
                        </div>
                        
                        <div className="mt-4 mb-4 text-sm ">
                          {location.AddressLine1} {location.AddressLine2} {location.City} {location.StateProvince} {location.PostalCode}
                        </div>
                        
                        <div className="mt-2 mb-4 text-sm">
                          Telephone : {location.Telephone}
                        </div>
                        
                        <div className="mt-4 mb-4 text-sm">
                          Hours {location.HoursOfOperation24.map((hours, index) => (
                                        <li key={index} style={{ display: 'inline', marginRight: '10px' }}>
                                            {hours.day}: {hours.hours}{index !== location.HoursOfOperation24.length - 1 && ', '}
                                        </li>
                                    ))}
                        </div>
                        <div className="mt-2 mb-4 text-sm">
                          Opened : {location.WeeklyOperatingDays}
                        </div>
                        
                       
                        </div>
                        </>
                        );
                    })}
                  </div>
                </div>
            </section>
        </>
    )
}
export default FindNearest