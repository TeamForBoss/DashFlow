import { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface CityProps {
  name: string;
  checkedCity: string | null;
  checkedEvt: (city: string) => void;
  className?: string;
}

const City = ({ name, checkedCity, checkedEvt, className }: CityProps) => {
  return (
    <button
      className={`city ${checkedCity === name ? 'checked' : ''} ${className || ''}`}
      onClick={() => checkedEvt(name)}>
      {name}
    </button>
  );
};

const RegionArea = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const toggleCheckedEvt = (city: string) => {
    setSelectedCity(prev => (prev === city ? null : city)); // 선택 취소 가능
  };

  // 경기도 북부지역 
  const NorthernGyeonggido = [
    '가평군', '고양시', '구리시', '남양주시', '동두천시', '양주시', '연천군', '의정부시', '파주시', '포천시'
  ];

  // 경기도 남부지역 
  const SouthernGyeonggido = [
    '과천시', '광명시', '광주시', '김포시', '군포시', '부천시', '성남시', '수원시', '시흥시', '안산시',
    '안성시', '안양시', '양평군', '여주시', '오산시', '용인시', '의왕시', '이천시', '평택시', '하남시', '화성시'
  ];

  return (
    <div className="regionArea">
      <div className="item">
        <div className="regionCategory">
          <p>경기도 북부 지역</p>
        </div>
        <div className="regionSubCategory">
          {NorthernGyeonggido.map((city, index) => (
            <City key={index} name={city} checkedCity={selectedCity}
            checkedEvt={toggleCheckedEvt} 
            className={selectedCity === city ? "checked" : ""} />
          ))}
        </div>
      </div>
      <div className="item">
        <div className="regionCategory">
          <p>경기도 남부 지역</p>
        </div>
        <div className="regionSubCategory">
          {SouthernGyeonggido.map((city, index) => (
            <City
              key={index}
              name={city}
              checkedCity={selectedCity}
              checkedEvt={toggleCheckedEvt}
              className={selectedCity === city ? "checked" : ""}
            />
          ))}
        </div>
      </div>
      <div className="item">
      <button className={`confirmBtn ${selectedCity ? "active" : "disabled"}`} disabled={!selectedCity}>
      <NavLink to={selectedCity ? `/accident-status` : "#"}>
        {selectedCity ? `${selectedCity} 정보 보러가기` : "지역을 선택해주세요."}
      </NavLink>
      </button>
      </div>
    </div>
  );
};

export default RegionArea;
