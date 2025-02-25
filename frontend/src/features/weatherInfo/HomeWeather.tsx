import sunny from '../../assets/images/icons/weather/sun.png';
import { useEffect , useState } from 'react';


import { useRecoilValue } from "recoil"; 


import { hostState } from "../../state/hostAtom.js"; 
import { selectedRegionState } from "../../state/atom.js"; 

const HomeWeather = () => {
    const host = useRecoilValue(hostState);
    const region = useRecoilValue(selectedRegionState);

    // const [weatherData , setWeatherData] = useState([]);
    // useEffect(()=>{
    //     fetch(`${host}/weather`,{
    //         method: "POST",
    //         headers: {
    //             "Content-Type" : "application/json"
    //         }
    //     })
    //     .then(res=>res.json())
    //     .then((data)=>{
    //         console.log(data)
    //         setWeatherData(data);
    //     });
    // }, [host]);


    return (
    <div className="averageWrap">
        <div className="waveContainer waveWeather">
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
            <div className="wave wave3"></div>
        </div>
        <div className="item homeWeatherItem">
            <div className="title">경기도 날씨</div>
            <div className="contents">
            <div className="content">
                <img src={sunny} alt="맑음" />
                <div className="info">
                <span className="value">10℃</span>
                <span className="text">맑음</span>
                </div>
            </div>
            <div className="content">
                <img src={sunny} alt="습도" />
                <div className="info">
                <span className="value">50%</span>
                <span className="text">습도</span>
                </div>
            </div>
            </div>
        </div>
    </div>
    )
}

export default HomeWeather;