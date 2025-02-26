import React from "react";
import "../assets/sass/selectPage.scss"; // 기존 CSS 적용
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import gyeonggiImg from "../assets/images/icons/selectPage/gyeongggi.png";
import seoulImg from "../assets/images/icons/selectPage/seoul.png";
import incheonImg from "../assets/images/icons/selectPage/incheon.png";

//  ==== recoil ===
import { useSetRecoilState } from "recoil";
import { selectedSectionState } from "../state/selectAtom.js";

const Selection = () => {
  const navigate = useNavigate();
  const setSelectedSection = useSetRecoilState(selectedSectionState); // 상태 업데이트 함수

  const handleClick = (area: string) => {
    setSelectedSection(area); 
    navigate("/home", { state: { id: area } }); 
  };

  return (
    <>
      <Header page={"select"} />
      <main className="selLayout">
        <section className="selMainArea">
          <div className="selBox selGyeonggi" onClick={() => handleClick("gyeonggi")}>
            <img src={gyeonggiImg} className="selImg" alt="경기도"></img>
            <p className={`selInText selInTextG`}>경기도 정보 바로가기</p>
          </div>
          <div className="selBox selSeoul" onClick={() => handleClick("seoul")}>
            <img src={seoulImg} className="selImg" alt="서울"></img>
            <p className={`selInText selInTextS`}>서울 정보 바로가기</p>
          </div>
          <div className="selBox selIncheon" onClick={() => handleClick("incheon")}>
            <img src={incheonImg} className="selImg" alt="인천"></img>
            <p className={`selInText selInTextI`}>인천 정보 바로가기</p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Selection;
