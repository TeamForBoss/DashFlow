import "../styles/selection2.css"; // 기존 CSS 적용

const Selection2 = () => {
  return (
    <div className="overallLayout">
      {/* 상단 타이틀 */}
      <div className="titleBarTop">안전신호등</div>

      {/* 대시보드 레이아웃 */}
      <div className="dashboard">
        {[1, 2].map((_, index) => (
          <div key={index} className="dataContainer">
            <div className="selectionTitle">지역선택하기</div>

            {/* 상단 데이터 박스 */}
            <div className="dataGrid">
              {[
                { className: "crimebgColor", text: "text" },
                { className: "accidentbgColor", text: "text" },
                { className: "weatherbgColor", text: "text" },
                { className: "headerFontColor", text: "text" },
              ].map((item, i) => (
                <div key={i} className={`smallData ${item.className}`}>
                  <span className="label">{item.text}</span>
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
  );
};

export default Selection2;