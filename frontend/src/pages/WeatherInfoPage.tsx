import { useEffect, useState } from "react";
import WeatherTrendGraph from "../features/weatherInfo/WeatherTrendGraph";
import WindRadarChart from "../features/weatherInfo/WindRadarChart";
import weatherFetchData from "../assets/tempData/weather_data.json";

const WeatherInfoPage = () => {
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [weekData, setWeekData] = useState<any[]>([]);
  const [windData, setWindData] = useState({ dt_txt: "", wind: { speed: 0, deg: 0 } });

  useEffect(() => {
    const now = new Date();
    const { data: { list } } = weatherFetchData[0];
    
    // 현재 시각 이후의 데이터 필터링
    const futureData = list.filter((item: any) => {
      const itemDate = new Date(item.dt_txt);
      return itemDate >= now;
    });
    
    setWeatherData(futureData);
    
    if (futureData.length > 0) {
      // 그래프용 데이터 (최대 20개)
      const visualDataLength = 20;
      const weekWeatherData = futureData.map((item: any) => ({
        dt_txt: item.dt_txt,
        main: { temp: item.main.temp }
      }));
      const weekVisualData = weekWeatherData.slice(0, visualDataLength);
      setWeekData(weekVisualData);
      
      // 풍향/풍속 데이터: 첫 번째 항목 사용
      setWindData({
        dt_txt: futureData[0].dt_txt,
        wind: futureData[0].wind
      });
    }
  }, []);

  // 날짜 라벨: 오늘이면 "오늘", 내일이면 "내일", 그 외에는 기본 형식으로 표시
  const getDateLabel = (dt_txt: string) => {
    const itemDate = new Date(dt_txt);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (
      itemDate.getFullYear() === today.getFullYear() &&
      itemDate.getMonth() === today.getMonth() &&
      itemDate.getDate() === today.getDate()
    ) {
      return "오늘 " + itemDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (
      itemDate.getFullYear() === tomorrow.getFullYear() &&
      itemDate.getMonth() === tomorrow.getMonth() &&
      itemDate.getDate() === tomorrow.getDate()
    ) {
      return "내일 " + itemDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else {
      return itemDate.toLocaleDateString() + " " + itemDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  };

  return (
    <section className="weatherPage">
      <section className="weatherLayOutArea">
        <article className="weatherTopSection">
          <div className="weatherSummaryWrap">
            <div className="weatherStatBox">
              <div className="weatherStat">
                <p>온도</p>
                <div className="weatherTemperature">11</div>
              </div>
              <div className="weatherStat">
                <p>습도</p>
                <div className="weatherHumidity">20%</div>
              </div>
              <div className="weatherStat">
                <p>풍속</p>
                <div className="weatherWindSpeed">1</div>
              </div>
            </div>
          </div>

          <div className="weatherGraphWrap">
            {/* 상세 날씨 정보를 표 형식으로 표시 */}
            <div className="weatherInfoListBox">
              <p>상세 날씨 정보</p>
              {/* 테이블 래퍼 추가 (스크롤용) */}
              <div className="weatherInfoTableWrapper">
                <table className="weatherInfoTable">
                  <thead>
                    <tr>
                      <th>시간</th>
                      <th>기온 (°C)</th>
                      <th>날씨</th>
                      <th>습도 (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weatherData.slice(0, 8).map((item, idx) => (
                      <tr key={idx} className="weatherInfoItem">
                        <td>{getDateLabel(item.dt_txt)}</td>
                        <td>{item.main.temp ?? "--"} °C</td>
                        <td>{item.visibility ?? "--"}</td>
                        <td>{item.main.humidity ?? "--"} %</td>
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

        <div className="weatherTrendWrap" style={{ marginTop: "var(--gapSize)" }}>
          <div className="weatherTrendBox">
            <div className="weatherTrendTitle">
              <p>단기 날씨 추세</p>
            </div>
            <div className="weatherTrendGraph">
              <WeatherTrendGraph data={weekData} />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default WeatherInfoPage;
