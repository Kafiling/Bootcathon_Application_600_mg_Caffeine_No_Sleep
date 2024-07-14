import React, { useState } from "react";

export const CarCare = (): JSX.Element => {
    const redImage = "https://cdn.discordapp.com/attachments/1257716666293555201/1261645363157401649/redbmw.png?ex=6693b64e&is=669264ce&hm=0d530e2cdcb995b0c5e7e0ce50233efe2c067876238c2ac8c2ecad174c452c4f&";
    const blueImage = "https://cdn.discordapp.com/attachments/1257716666293555201/1261645363496878130/bluebmw.png?ex=6693b64e&is=669264ce&hm=99940e014607e508247afced9b0914322615a03842dfb0842716868ad776ac5e&";

    const [currentImage, setCurrentImage] = useState(blueImage);
    const [selected, setSelected] = useState({
        oilChange: false,
        brakeCheck: false,
        tireCheck: false,
        engineCheck: false,
    });

    const toggleImage = () => {
        setCurrentImage(currentImage === blueImage ? redImage : blueImage);
    };

    const toggleSelection = (service : any) => {
        setSelected((prevSelected) => ({
            ...prevSelected,
            [service]: !prevSelected[service],
        }));
    };

    return (
        <div className="bg-white flex flex-col items-center w-full min-h-screen">
            <div className="w-full max-w-md h-auto">
                <div className="relative w-full h-full">
                    <header className="w-full h-[62px] top-[116px] left-0 bg-transparent">
                        <div className="relative w-full h-[62px] bg-[#004894] flex items-center justify-between px-4">
                            <div className="flex items-center">
                                <img className="w-[50px] h-[50px]" alt="Logo" src="https://cdn.discordapp.com/attachments/1261221921597423626/1261240782460031066/logo-placeholder-image.png?ex=6692e643&is=669194c3&hm=445c43b722103af3af7007011f8eab1486db7d5475016d434c660949324b637d&" />
                                <div className="font-bold text-white text-[28px] tracking-[0] leading-[normal] px-4">
                                    CAR CARE
                                </div>
                            </div>
                            <div className="w-[57px] h-[57px] bg-white rounded-full border-[3px] border-solid border-[#11315e] flex items-center justify-center">
                                <img className="w-[35px] h-[47px]" alt="Account" src="https://cdn.discordapp.com/attachments/1261221921597423626/1261594294075265166/Account.png?ex=669386be&is=6692353e&hm=9a2f3719a52ed91c3e0e9558efe4285a434a1fcafaff1038cd06c0839575fb2a&" />
                            </div>
                        </div>
                    </header>
                    <div className="absolute w-full h-full top-0 left-0">
                        <div className="absolute w-full h-[calc(100vh-183px)] top-[116px] left-0 bg-[#f1f1f1]" />
                    </div>
                    <div className="absolute w-full h-[635px] top-18 left-0">
                        <div className="absolute w-full h-12 top-0 left-0 bg-[#2e60a7]">
                            <div className="w-[301px] top-[3px] left-[17px] text-white text-[28px] absolute font-bold tracking-[0] leading-[normal] ">
                                คุณต้องการใช้บริการไหน
                            </div>
                        </div>
                        <div className="absolute w-full h-[550px] top-12 left-0">
                            <div className="absolute w-full h-[550px] top-0 left-0 bg-white" />
                            <div className="absolute w-[90%] max-w-[379px] h-[587px] top-[0px] left-1/2 transform -translate-x-1/2">
                                <div className="absolute w-full h-[368px] top-4 left-0 grid grid-cols-2 gap-4">
                                    <div
                                        className={`w-full h-[177px] rounded-[10px] shadow-md relative ${selected.oilChange ? 'bg-[#CCD1D1]' : 'bg-neutral-50'}`}
                                        onClick={() => toggleSelection("oilChange")}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            className="w-[80%] h-[135px] object-cover mx-auto rounded-[10px] mt-3"
                                            alt="oilchange"
                                            src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/oilchange.png"
                                        />
                                        <div className="text-black font-bold tracking-[0] leading-[normal] text-center text-sm xs:text-base absolute bottom-1.5 left-0 right-0">
                                            การบำรุงรักษาทั่วไป
                                        </div>
                                    </div>
                                    <div
                                        className={`w-full h-[177px] rounded-[10px] shadow-md relative ${selected.brakeCheck ? 'bg-[#CCD1D1]' : 'bg-neutral-50'}`}
                                        onClick={() => toggleSelection("brakeCheck")}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            className="w-[80%] h-[135px] object-cover mx-auto rounded-[10px] mt-3"
                                            alt="breakcheck"
                                            src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/breakcheck.png"
                                        />
                                        <div className="text-black font-bold tracking-[0] leading-[normal] text-center text-sm xs:text-base absolute bottom-1.5 left-0 right-0">
                                            การตรวจเช็คระบบเบรก
                                        </div>
                                    </div>
                                    <div
                                        className={`w-full h-[177px] rounded-[10px] shadow-md relative ${selected.tireCheck ? 'bg-[#CCD1D1]' : 'bg-neutral-50'}`}
                                        onClick={() => toggleSelection("tireCheck")}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            className="w-[80%] h-[135px] object-cover mx-auto rounded-[10px] mt-3"
                                            alt="tirecheck"
                                            src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/tirecheck.png"
                                        />
                                        <div className="text-black font-bold tracking-[0] leading-[normal] text-center text-sm xs:text-base absolute bottom-1.5 left-0 right-0">
                                            การตรวจเช็คยางรถยนต์
                                        </div>
                                    </div>
                                    <div
                                        className={`w-full h-[177px] rounded-[10px] shadow-md relative ${selected.engineCheck ? 'bg-[#CCD1D1]' : 'bg-neutral-50'}`}
                                        onClick={() => toggleSelection("engineCheck")}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            className="w-[80%] h-[135px] object-cover mx-auto rounded-[10px] mt-3"
                                            alt="enginecheck"
                                            src="https://mobil-at-home.s3.ap-southeast-1.amazonaws.com/enginecheck.png"
                                        />
                                        <div className="text-black font-bold tracking-[0] leading-[normal] text-center text-sm xs:text-base absolute bottom-1.5 left-0 right-0">
                                            การบำรุงรักษาเครื่องยนต์
                                        </div>
                                    </div>
                                </div>
                                <img
                                    className="absolute top-[460px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[270px] h-[13%] object-cover rounded-[10px]"
                                    alt="Appointments"
                                    src={currentImage}
                                    onClick={toggleImage}
                                    style={{ cursor: 'pointer' }}
                                />
                                <div className="text-red tracking-[0] top-[505px] leading-[normal] text-center text-xs absolute bottom-1.5 left-0 right-0">
                                    โปรดเลือกบริการเพื่อจอง
                                </div>
                            </div>
                            <div className="absolute w-full h-1.5 top-[402px] left-0 bg-[#F1F1F1]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarCare;
