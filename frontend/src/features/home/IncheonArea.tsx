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

  // **인천 구 (도시 지역)**
  const incheonDistricts: City[] = [
    { ko: "계양구", en: "gyeyang" },
    { ko: "미추홀구", en: "michuhol" },
    { ko: "남동구", en: "namdong" },
    { ko: "동구", en: "dong" },
    { ko: "부평구", en: "bupyeong" },
    { ko: "서구", en: "seo" },
    { ko: "연수구", en: "yeonsu" },
  ];

  // **인천 군 (군 지역)**
  const incheonCounty: City[] = [
    { ko: "강화군", en: "ganghwa" },
    { ko: "옹진군", en: "ongjin" },
  ];

  const allCities: City[] = [...incheonDistricts, ...incheonCounty];
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
          <p>인천시 도시 지역</p>
        </div>
        <div className="regionSubCategory">
          {incheonDistricts.map((city, index) => (
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
          <p>인천시 군 지역</p>
        </div>
        <div className="regionSubCategory">
          {incheonCounty.map((city, index) => (
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
