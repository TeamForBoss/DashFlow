import React from "react";
import { NavLink } from "react-router-dom";
import SelectPage from "../pages/SelectPage";

// == logo == 
import logo from "../assets/images/logo/main_logo.png";
import seoulLogo from "../assets/images/logo/logo_seoul.png";
import gyeonggiLogo from "../assets/images/logo/logo_gyeonggi.png";
import incheonLogo from "../assets/images/logo/logo_incheon.png";
import goBack from "../assets/images/svg/goBack.png";

// == recoil == 
import { selectedRegionState } from "../state/atom.js";
import {selectedSectionState} from "../state/selectAtom.js";
import { useRecoilValue } from "recoil";

interface HeaderProps {
  page: "select" | "home" | "accident" | "crime" | "weather";
}

type PageTextConfig = {
  text: string;
  color: string;
  nav: string;
};

const textConfig: Record<HeaderProps["page"], PageTextConfig> = {
  select: { text: "", color: "", nav: "/" },
  home: { text: "", color: "", nav: "/home" },
  accident: { text: "사고 발생 연평균", color: "header-text-accident", nav: "/accident-status" },
  crime: { text: "범죄 발생 연평균", color: "header-text-crime", nav: "/crime-report" },
  weather: { text: "날씨 정보", color: "header-text-weather", nav: "/weather-info" },
};

type ButtonConfig = {
  page: Exclude<HeaderProps["page"], "home">;
  text: string;
  nav: string;
};

const allButtons: ButtonConfig[] = [
  { page: "crime", text: "범죄", nav: textConfig.crime.nav },
  { page: "accident", text: "사고", nav: textConfig.accident.nav },
  { page: "weather", text: "날씨", nav: textConfig.weather.nav },
];

const Header: React.FC<HeaderProps> = ({ page }) => {
    const selectedRegion = useRecoilValue<string>(selectedRegionState);
    const selectedSection = useRecoilValue(selectedSectionState); 

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
  
    // 서울특별시 구 데이터
    gangnam: "강남구",
    gangdong: "강동구",
    gangbuk: "강북구",
    gangseo: "강서구",
    gwanak: "관악구",
    gwangjin: "광진구",
    guro: "구로구",
    geumcheon: "금천구",
    nowon: "노원구",
    dobong: "도봉구",
    dongdaemun: "동대문구",
    dongjak: "동작구",
    mapo: "마포구",
    seodaemun: "서대문구",
    seocho: "서초구",
    seongdong: "성동구",
    seongbuk: "성북구",
    songpa: "송파구",
    yangcheon: "양천구",
    yeongdeungpo: "영등포구",
    yongsan: "용산구",
    eunpyeong: "은평구",
    jongno: "종로구",
    "seoul-jung": "중구",
    jungnang: "중랑구",
  
    // 인천광역시 군·구 데이터 추가
    ganghwa: "강화군",
    gyeyang: "계양구",
    michuhol: "미추홀구",
    namdong: "남동구",
    dong: "동구",
    bupyeong: "부평구",
    seo: "서구",
    yeonsu: "연수구",
    ongjin: "옹진군",
    "Incheon-jung": "중구",
  };

  const sectionLogo = page === "select"
    ? logo
    : selectedSection === "seoul"
    ? seoulLogo
    : selectedSection === "gyeonggi"
    ? gyeonggiLogo
    : selectedSection === "incheon"
    ? incheonLogo
    : logo;

  const displayText =
    page === "home"
      ? textConfig[page].text
      : selectedRegion
      ? `${Gyeonggido[selectedRegion]} ${textConfig[page].text}`
      : textConfig[page].text;

  return (
    <header className={`header-container ${(page === "home" || page === "select") ? "header-home" : "header-etc"}`}>
        {page === "home" && (
          <div className="homeNav">
            <NavLink to="/">
              <img className="goHome" src={goBack} alt="home" />
            </NavLink>
          </div>
        )}
        <div className="header-logo">
            <NavLink to={textConfig.home.nav}>
                <img src={sectionLogo } alt="안전신호등 로고" className="header-logo-img" />
            </NavLink>
        </div>
      {page !== "home" && page !== "select" && (
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
