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

const RegionArea = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] =
    useRecoilState(selectedRegionState);

  const toggleCheckedEvt = (city: string) => {
    setSelectedCity((prev) => (prev === city ? null : city));
  };

  const NorthernGyeonggido: City[] = [
    { ko: "가평군", en: "gapyeong" },
    { ko: "고양시", en: "goyang" },
    { ko: "구리시", en: "guri" },
    { ko: "남양주시", en: "namyangju" },
    { ko: "동두천시", en: "dongducheon" },
    { ko: "양주시", en: "yangju" },
    { ko: "연천군", en: "yeoncheon" },
    { ko: "의정부시", en: "uijeongbu" },
    { ko: "파주시", en: "paju" },
    { ko: "포천시", en: "pocheon" },
  ];

  const SouthernGyeonggido: City[] = [
    { ko: "과천시", en: "gwacheon" },
    { ko: "광명시", en: "gwangmyeong" },
    { ko: "광주시", en: "gwangju" },
    { ko: "김포시", en: "gimpo" },
    { ko: "군포시", en: "gunpo" },
    { ko: "부천시", en: "bucheon" },
    { ko: "성남시", en: "seongnam" },
    { ko: "수원시", en: "suwon" },
    { ko: "시흥시", en: "siheung" },
    { ko: "안산시", en: "ansan" },
    { ko: "안성시", en: "anseong" },
    { ko: "안양시", en: "anyang" },
    { ko: "양평군", en: "yangpyeong" },
    { ko: "여주시", en: "yeoju" },
    { ko: "오산시", en: "osan" },
    { ko: "용인시", en: "yongin" },
    { ko: "의왕시", en: "uiwang" },
    { ko: "이천시", en: "icheon" },
    { ko: "평택시", en: "pyeongtaek" },
    { ko: "하남시", en: "hanam" },
    { ko: "화성시", en: "hwaseong" },
  ];

  const allCities: City[] = [...NorthernGyeonggido, ...SouthernGyeonggido];
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
          <p>경기도 북부 지역</p>
        </div>
        <div className="regionSubCategory">
          {NorthernGyeonggido.map((city, index) => (
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
          <p>경기도 남부 지역</p>
        </div>
        <div className="regionSubCategory">
          {SouthernGyeonggido.map((city, index) => (
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

export default RegionArea;
