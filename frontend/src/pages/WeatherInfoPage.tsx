import React, { useEffect, useState } from "react";
import WeatherTrendGraph from "../features/weatherInfo/WeatherTrendGraph";
import WindRadarChart from "../features/weatherInfo/WindRadarChart";

// == recoil ==
import { useRecoilValue } from "recoil";
import { hostState } from "../state/hostAtom.js";
import { selectedRegionState } from "../state/atom.js";

// == json ==
import weatherDescription from "../assets/data/weatherData/weather_description.json";

// == images ==
import temperatureImg from "../assets/images/icons/weather/temp.png";
import humidityImg from "../assets/images/icons/weather/rain_blue.png";
import directionImg from "../assets/images/icons/weather/direction.png";

import Header from "../components/Header";

const WeatherInfoPage: React.FC = () => {
  // recoil
  const host = useRecoilValue(hostState);
  const region = useRecoilValue(selectedRegionState);

  const [weatherFetchData, setWeatherFetchData] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [weekData, setWeekData] = useState<any[]>([]);
  const [windData, setWindData] = useState({ dt_txt: "", wind: { speed: 0, deg: 0 } });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch(`${host}/weather/city`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ city: region }),
    })
      .then((res) => res.json())
      .then((data) => {
        setWeatherFetchData(data);
        const now = new Date();
        const {
          data: { list },
        } = data[0];

        const futureData = list.filter((item: any) => {
          const itemDate = new Date(item.dt_txt);
          return itemDate >= now;
        });

        setWeatherData(futureData);

        if (futureData.length > 0) {
          // 모바일일 경우 그래프 데이터 8개, 그 외에는 20개 설정정
          const visualDataLength = isMobile ? 8 : 20;
          const weekWeatherData = futureData.map((item: any) => ({
            dt_txt: item.dt_txt,
            main: { temp: item.main.temp },
          }));
          const weekVisualData = weekWeatherData.slice(0, visualDataLength);
          setWeekData(weekVisualData);
          setWindData({
            dt_txt: futureData[0].dt_txt,
            wind: futureData[0].wind,
          });
        }
        // console.log(weatherData);
      });
  }, [host, isMobile]);

  const getDateLabel = (dt_txt: string) => {
    const itemDate = new Date(dt_txt);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // 12시간제로 변환
    const hour = itemDate.getHours();
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const period = hour >= 12 ? "오후" : "오전";
    const timeStr = `${period} ${displayHour}시`;

    if (
      itemDate.getFullYear() === today.getFullYear() &&
      itemDate.getMonth() === today.getMonth() &&
      itemDate.getDate() === today.getDate()
    ) {
      return `오늘 ${timeStr}`;
    } else if (
      itemDate.getFullYear() === tomorrow.getFullYear() &&
      itemDate.getMonth() === tomorrow.getMonth() &&
      itemDate.getDate() === tomorrow.getDate()
    ) {
      return `내일 ${timeStr}`;
    } else {
      return `${itemDate.toLocaleDateString()} ${timeStr}`;
    }
  };

  return (
    <>
      <Header page={"weather"} />
      <section className="weatherPageWrapper">
        <section className="weatherLayOutArea">
          <article className="weatherTopSection">
            <div className="weatherSummaryWrap">
              <div className="weatherStatBox">
                <div className="weatherStat">
                  <div className="weatherStatTitle">
                    <p>온도</p>
                    <img src={temperatureImg} alt="온도 아이콘" />
                  </div>
                  <div className="weatherStatValue">
                    {weatherData[0]?.main?.temp.toFixed(1) ?? "--"} °C
                  </div>
                </div>
                <div className="weatherStat">
                  <div className="weatherStatTitle">
                    <p>습도</p>
                    <img src={humidityImg} alt="습도 아이콘" />
                  </div>
                  <div className="weatherStatValue">
                    {weatherData[0]?.main?.humidity ?? "--"} %
                  </div>
                </div>
                <div className="weatherStat directionStat">
                  <div className="weatherStatTitle">
                    <p>풍속</p>
                    <img src={directionImg} alt="풍향 아이콘" />
                  </div>
                  <div className="weatherStatValue">
                    {weatherData[0]?.wind?.speed ?? "--"} m/s
                  </div>
                </div>
              </div>
            </div>

            <div className="weatherGraphWrap">
              <div className="weatherInfoListBox">
                <p>상세 기상 정보</p>
                <div className="weatherInfoTableWrapper">
                  <table className="weatherInfoTable">
                    <thead>
                      <tr>
                        <th>시간</th>
                        <th>기온 (°C)</th>
                        <th>습도 (%)</th>
                        <th className="weatherForecast">예보</th>
                        <th>상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weatherData.slice(0, isMobile ? 6 : 8).map((item, idx) => (
                        <tr key={idx} className="weatherInfoItem">
                          <td>{getDateLabel(item.dt_txt)}</td>
                          <td>{item.main.temp.toFixed(1) ?? "--"} °C</td>
                          <td >{item.main.humidity ?? "--"} %</td>
                          <td className="weatherForecast">
                            {
                              weatherDescription.find(data => data.code === item.weather[0].id)
                                ?.txt_ko ??
                              item.weather[0].description ??
                              "--"
                            }
                          </td>
                          <td>
                            <img
                              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                              alt="weather icon"
                              className="weatherDesIcon"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="weatherWindRadarSection">
                <p>현재 풍향/풍속 레이더</p>
                <div className="weatherWindRadarBox">
                  <WindRadarChart data={windData} />
                </div>
              </div>
            </div>
          </article>

          <div className="weatherTrendWrap">
            <div className="weatherTrendBox">
              <div className="weatherTrendTitle">
                <p>단기 기상 추세</p>
              </div>
              <div className="weatherTrendGraph">
                <WeatherTrendGraph data={weekData} />
              </div>
            </div>
          </div>
        </section>
        </section>
    </>
  );
};

export default WeatherInfoPage;
