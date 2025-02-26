import React from "react";
import "../assets/sass/selectPage.scss"; // 기존 CSS 적용
import Header from "../components/Header";
import { NavLink } from "react-router-dom";
import gyeonggiImg from "../assets/images/icons/selectPage/gyeongggi.png";
import seoulImg from "../assets/images/icons/selectPage/seoul.png";
import incheonImg from "../assets/images/icons/selectPage/incheon.png";

const Selection = () => {
  return (
    <>
      <Header page={"home"} />
      <main className="selLayout">
        <section className="selMainArea">
          <NavLink to={`/home`} className="selBox selGyeonggi">
            <img src={gyeonggiImg} className="selImg"></img>
            <p className={`selInText selInTextG`}>경기도 정보 바로가기</p>
          </NavLink>
          <NavLink to={`/home`} className="selBox selSeoul">
            <img src={seoulImg} className="selImg"></img>
            <p className={`selInText selInTextS`}>서울 정보 바로가기</p>
          </NavLink>
          <NavLink to={`/home`} className="selBox selIncheon">
            <img src={incheonImg} className="selImg"></img>
            <p className={`selInText selInTextI`}>인천 정보 바로가기</p>
          </NavLink>
        </section>
      </main>
    </>
  );
};

export default Selection;
