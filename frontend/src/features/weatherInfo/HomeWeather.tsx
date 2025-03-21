import temp from '../../assets/images/icons/weather/temp.png';
import humadity from '../../assets/images/icons/weather/rain_mint.png';
import { useEffect , useState } from 'react';

// == recoil ==
import { useRecoilValue } from "recoil"; 
import {selectedSectionState} from "../../state/selectAtom.js";

import { hostState } from "../../state/hostAtom.js"; 

const HomeWeather: React.FC = () => {
    const host = useRecoilValue(hostState);
    const currentSido = useRecoilValue(selectedSectionState);
    const matchingSido: object = {
		seoul : "서울시",
		gyeonggi : "경기도",
		incheon: "인천시",
    }
    const [weatherData , setWeatherData] = useState([]);
    const [currentData, setCurrentData] = useState([]); 
    useEffect(()=>{
        fetch(`${host}/weather`,{
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            }
        })
        .then(res=>res.json())
        .then((data)=>{
            let currentDataAll = data;
            // console.log(data)
            switch(currentSido){
                case "seoul":
                    currentDataAll = data.filter((item: any)=>{
                        return item["city"] === "seoul-jung";
                    });
                break;

                case "gyeonggi":
                    currentDataAll = data.filter((item: any)=>{
                        return item["city"] === "suwon";
                    });
                break;

                case "incheon":
                    currentDataAll = data.filter((item: any)=>{
                        return item["city"] === "bupyeong";
                    });
                break;
            }

            setWeatherData(data);
            const currentTime = new Date();
            const currentDataList = currentDataAll[0]["data"]["list"].filter((item)=>{
            const itemDate = new Date(item.dt_txt);
                return itemDate > currentTime;
            });
            setCurrentData(currentDataList[0]);
        });
    }, [host]);

    return (
    <div className="averageWrap">
        <div className="waveContainer waveWeather">
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
            <div className="wave wave3"></div>
        </div>
        <div className="item homeWeatherItem">
            <div className="title">{matchingSido[currentSido]} 날씨</div>
            <div className="contents">
            <div className="content">
                <img src={temp} alt="맑음" />
                <div className="info">
                <span className="text">기온</span>
                <span className="value">{currentData?.main?.temp.toFixed(1) ?? "--"}℃</span>
                </div>
            </div>
            <div className="content">
                <img src={humadity} alt="습도" />
                <div className="info">
                <span className="text">습도</span>
                <span className="value">{currentData?.main?.humidity ?? "--"}%</span>
                </div>
            </div>
            </div>
        </div>
    </div>
    )
}

export default HomeWeather;