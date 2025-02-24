import React from "react";
import { NavLink } from "react-router-dom";
import { useRecoilValue } from "recoil";
import logo from "../assets/images/logo/main_logo.png";
import { selectedRegionState } from "../state/atom.js";

interface HeaderProps {
  page: "home" | "accident" | "crime" | "weather";
}

type PageTextConfig = {
  text: string;
  color: string;
  nav: string;
};

const textConfig: Record<HeaderProps["page"], PageTextConfig> = {
  home: { text: "", color: "", nav: "/" },
  accident: { text: "사고 발생 현황", color: "header-text-accident", nav: "/accident-status" },
  crime: { text: "범죄 발생 현황", color: "header-text-crime", nav: "/crime-report" },
  weather: { text: "날씨 정보", color: "header-text-weather", nav: "/weather-info" },
};

type ButtonConfig = {
  page: Exclude<HeaderProps["page"], "home">;
  text: string;
  nav: string;
};

const allButtons: ButtonConfig[] = [
  { page: "weather", text: "날씨", nav: textConfig.weather.nav },
  { page: "accident", text: "사고", nav: textConfig.accident.nav },
  { page: "crime", text: "범죄", nav: textConfig.crime.nav },
];

const Header: React.FC<HeaderProps> = ({ page }) => {
  const selectedRegion = useRecoilValue(selectedRegionState);

  const Gyeonggido: Record<string, string> = {
    gapyeong: "가평군",
    goyang: "고양시",
    guri: "구리시",
    namyangju: "남양주시",
    dongducheon: "동두천시",
    yangju: "양주시",
    yeoncheon: "연천군",
    uijeongbu: "의정부시",
    paju: "파주시",
    pocheon: "포천시",
    gwacheon: "과천시",
    gwangmyeong: "광명시",
    gwangju: "광주시",
    gimpo: "김포시",
    gunpo: "군포시",
    bucheon: "부천시",
    seongnam: "성남시",
    suwon: "수원시",
    siheung: "시흥시",
    ansan: "안산시",
    anseong: "안성시",
    anyang: "안양시",
    yangpyeong: "양평군",
    yeoju: "여주시",
    osan: "오산시",
    yongin: "용인시",
    uiwang: "의왕시",
    icheon: "이천시",
    pyeongtaek: "평택시",
    hanam: "하남시",
    hwaseong: "화성시",
  };

  const displayText =
    page === "home"
      ? textConfig[page].text
      : selectedRegion
      ? `${Gyeonggido[selectedRegion]} ${textConfig[page].text}`
      : textConfig[page].text;

  return (
    <header className={`header-container ${page === "home" ? "header-home" : "header-etc"}`}>
      <div className="header-logo">
        <NavLink to={textConfig.home.nav}>
          <img src={logo} alt="안전신호등 로고" className="header-logo-img" />
        </NavLink>
      </div>
      {page !== "home" && (
        <>
          <span className={`header-subtitle ${textConfig[page].color}`}>
            {displayText}
          </span>
          <div className="header-buttons">
            {allButtons.map((btn, index) =>
              btn.page === page ? (
                <span key={index} className="header-btn active">
                  {btn.text}
                </span>
              ) : (
                <NavLink key={index} to={btn.nav} className="header-btn">
                  {btn.text}
                </NavLink>
              )
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
