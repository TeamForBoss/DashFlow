import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useRecoilState } from "recoil";
import { selectedRegionState } from "../../state/atom.js";

interface City {
  ko: string;
  en: string;
}

interface CityProps {
  city: City;
  selectedCity: string | null;
  toggleCheckedEvt: (city: string) => void;
  className?: string;
}

const CityCheckbox = ({
  city,
  selectedCity,
  toggleCheckedEvt,
  className,
}: CityProps) => {
  const isChecked = selectedCity === city.en;
  return (
    <label className={`city ${isChecked ? "checked" : ""} ${className || ""}`}>
      <input
        type="checkbox"
        name="city"
        value={city["en"]}
        checked={isChecked}
        onChange={() => toggleCheckedEvt(city.en)}
      />
      {city.ko}
    </label>
  );
};

const SeoulArea = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] =
    useRecoilState(selectedRegionState);

  const toggleCheckedEvt = (city: string) => {
    setSelectedCity((prev) => (prev === city ? null : city));
  };

  // **강남권** (남부)
  const gangnamArea: City[] = [
    { ko: "강남구", en: "gangnam" },
    { ko: "서초구", en: "seocho" },
    { ko: "송파구", en: "songpa" },
    { ko: "강동구", en: "gangdong" },
    { ko: "양천구", en: "yangcheon" },
    { ko: "영등포구", en: "yeongdeungpo" },
  ];

  // **강북권** (북부)
  const gangbukArea: City[] = [
    { ko: "강북구", en: "gangbuk" },
    { ko: "도봉구", en: "dobong" },
    { ko: "노원구", en: "nowon" },
    { ko: "성북구", en: "seongbuk" },
    { ko: "동대문구", en: "dongdaemun" },
    { ko: "중랑구", en: "jungnang" },
  ];

  // **서북권** (서부)
  const seobukArea: City[] = [
    { ko: "마포구", en: "mapo" },
    { ko: "서대문구", en: "seodaemun" },
    { ko: "종로구", en: "jongno" },
    { ko: "구로구", en: "guro" },
    { ko: "성동구", en: "seongdong" },
  ];

  // **동북권** (동부)
  const dongbukArea: City[] = [
    { ko: "광진구", en: "gwangjin" },
    { ko: "동작구", en: "dongjak" },
    { ko: "관악구", en: "gwanak" },
    { ko: "금천구", en: "geumcheon" },
    { ko: "중구", en: "jung" },
    { ko: "용산구", en: "yongsan" },
    { ko: "은평구", en: "eunpyeong" },
  ];

  const allCities: City[] = [
    ...gangnamArea,
    ...gangbukArea,
    ...seobukArea,
    ...dongbukArea,
  ];
  const selectedCityKo = allCities.find((city) => city.en === selectedCity)?.ko;

  const handleSelectedRegion = () => {
    if (selectedCity) {
      setSelectedRegion(selectedCity);
    }
  };

  useEffect(() => {
    console.log("RECOIL SET: " + selectedRegion);
  }, [selectedRegion]);

  return (
    <div className="regionArea">
      <div className="item">
        <div className="regionCategory">
          <p>강남권</p>
        </div>
        <div className="regionSubCategory">
          {gangnamArea.map((city, index) => (
            <CityCheckbox
              key={index}
              city={city}
              selectedCity={selectedCity}
              toggleCheckedEvt={toggleCheckedEvt}
            />
          ))}
        </div>
      </div>
      <div className="item">
        <div className="regionCategory">
          <p>강북권</p>
        </div>
        <div className="regionSubCategory">
          {gangbukArea.map((city, index) => (
            <CityCheckbox
              key={index}
              city={city}
              selectedCity={selectedCity}
              toggleCheckedEvt={toggleCheckedEvt}
            />
          ))}
        </div>
      </div>
      <div className="item">
        <div className="regionCategory">
          <p>강서권</p>
        </div>
        <div className="regionSubCategory">
          {seobukArea.map((city, index) => (
            <CityCheckbox
              key={index}
              city={city}
              selectedCity={selectedCity}
              toggleCheckedEvt={toggleCheckedEvt}
            />
          ))}
        </div>
      </div>
      <div className="item">
        <div className="regionCategory">
          <p>강동권</p>
        </div>
        <div className="regionSubCategory">
          {dongbukArea.map((city, index) => (
            <CityCheckbox
              key={index}
              city={city}
              selectedCity={selectedCity}
              toggleCheckedEvt={toggleCheckedEvt}
            />
          ))}
        </div>
      </div>
      <div className="item">
        <NavLink to={selectedCity ? `/weather-info` : "#"}>
          <button
            onClick={handleSelectedRegion}
            className={`confirmBtn ${selectedCity ? "active" : "disabled"}`}
            disabled={!selectedCity}
          >
            {selectedCity
              ? `${selectedCityKo} 정보 보러가기`
              : "지역을 선택해주세요."}
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default SeoulArea;
