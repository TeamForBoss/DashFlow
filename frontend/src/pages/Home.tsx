import "../styles/style.scss"; // 기존 스타일 유지
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  return (
    <div className="overallWrapper">
      <div className="overallLayout">
        {/* 체크박스 그룹 */}
        <div className="allCheckbox">
          <div className="northernGyeonggidoBtn">
            <div className="titleNorthernGyeonggido">경기도 북부</div>
            {[
              "가평군",
              "고양시",
              "구리시",
              "남양주시",
              "동두천시",
              "양주시",
              "연천군",
              "의정부시",
              "파주시",
              "포천시",
            ].map((city, index) => (
              <button key={index} className="checkbox">
                {city}
              </button>
            ))}
          </div>

          <div className="southernGyeonggidoBtn">
            <div className="titleSouthernGyeonggido">경기도 남부</div>
            {[
              "과천시",
              "광명시",
              "광주시",
              "김포시",
              "군포시",
              "부천시",
              "성남시",
              "수원시",
              "시흥시",
              "안산시",
              "안성시",
              "안양시",
              "양평군",
              "여주시",
              "오산시",
              "용인시",
              "의왕시",
              "이천시",
              "평택시",
              "하남시",
              "화성시",
            ].map((city, index) => (
              <button key={index} className="checkbox">
                {city}
              </button>
            ))}
          </div>

          {/* 확인 버튼 */}
          <button className="checkboxStart" onClick={() => navigate("/dashboard")}>
            확인
          </button>
        </div>

        {/* 평균 데이터 박스 */}
        <div className="averageData">
          {[
            { title: "평균 날씨", className: "weather" },
            { title: "평균 사고", className: "accident" },
            { title: "평균 범죄", className: "crime" },
          ].map((item, index) => (
            <div key={index} className={`averageDataMini ${item.className}`}>
              <div className="averageDataTitleTop">{item.title}</div>
              <div className="averageDataTitleBottom">상세보기</div>
              <div className="wave"></div>
              <div className="wave -two"></div>
              <div className="wave -three"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
