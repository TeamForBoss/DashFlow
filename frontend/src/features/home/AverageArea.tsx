import HomeWeather from '../weatherInfo/HomeWeather';
import HomeAccident from '../accidentStatus/HomeAccident';
import HomeCrime from '../crimeReport/HomeCrime';

const AverageArea = () => {
  return (
    <div className="averageArea">
      <HomeWeather/>
      <HomeAccident/>
      <HomeCrime/>
    </div>
  );
};

export default AverageArea;
