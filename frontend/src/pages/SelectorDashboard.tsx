import "../styles/selection1.scss"; // 기존 CSS 적용
import { useNavigate } from "react-router-dom";

const SelectorDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="overallWrapper">
      <div className="overallLayout">
        {/* 대시보드 레이아웃 */}
        <div className="dashboard">
          {[ 
            { title: "오늘의 날씨", className: "weatherbgColor", path: "/weather-info" },
            { title: "오늘의 사고", className: "accidentbgColor", path: "/accident-status" },
            { title: "오늘의 범죄", className: "crimebgColor", path: "/crime-report" },
          ].map((item, index) => (
            <div key={index} className={`dataContainer ${item.className}`}>
              <div className="selectionTitle" onClick={() => navigate(item.path)}>{item.title}</div>
              {/* 상단 데이터 박스 */}
              <div className="dataGrid">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="smallData">
                    <span className="label">text</span>
                    <span className="value">00</span>
                  </div>
                ))}
              </div>
              {/* 하단 데이터 컨테이너 */}
              <div className="dataContainer02">
                <div className="labelBigData">00도 오늘의 데이터</div>
                <div className="chart">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="chartBox"></div>
                  ))}
                </div>
                <div className="dttaContainer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectorDashboard;