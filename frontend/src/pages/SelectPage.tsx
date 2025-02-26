import React from "react";
import "../assets/sass/selectPage.scss"; // 기존 CSS 적용
import Header from "../components/Header";
import { NavLink, useNavigate } from "react-router-dom";
import gyeonggiImg from "../assets/images/icons/selectPage/gyeongggi.png";
import seoulImg from "../assets/images/icons/selectPage/seoul.png";
import incheonImg from "../assets/images/icons/selectPage/incheon.png";

const Selection = () => {
const navigate = useNavigate();

  const handleClick = (area: string) => {
    navigate("/home", { state: { id: area } });
  };
  return (
    <>
      <Header page={"home"} />
      <main className="selLayout">
        <section className="selMainArea">
          <div className="selBox selGyeonggi">
            <img src={gyeonggiImg} className="selImg"></img>
              <button className={`selInText selInTextG`} onClick={()=>handleClick("gyeonggi")}>
                경기도 정보 바로가기
              </button>
          </div>
          <div className="selBox selSeoul">
            <img src={seoulImg} className="selImg"></img>
              <button className={`selInText selInTextS`} onClick={()=>handleClick("seoul")}>
                서울 정보 바로가기
              </button>
          </div>
          <div className="selBox selIncheon">
            <img src={incheonImg} className="selImg"></img>
              <button className={`selInText selInTextI`} onClick={()=>handleClick("incheon")}>
                인천 정보 바로가기
              </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Selection;
