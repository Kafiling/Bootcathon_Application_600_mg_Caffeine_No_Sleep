import React from 'react'

function ServiceAtHomeConfirm() {
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
<div className='px-[10vw] h-[100vh] flex-col place-content-center place-items-center justify-center justify-items-center align-middle content-center'>
<img className="justify-center justify-self-center px-[10vw] h-auto" src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/accept.png" alt="image description"></img>
<p className="my-4 text-lg text-black col-span-2 text-center">ขอบคุณที่เลือกใช้บริการกับเรา! 🙏✨ <br></br> ข้อมูลยืนยันการจองจะถูกส่งผ่านทางไลน์ในภายหลัง </p>  

</div>
  

    </>
  )
}

export default ServiceAtHomeConfirm