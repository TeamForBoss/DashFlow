const CrimeReportPage = () => {
  return (
    <section id="crMainArea" className="crMainArea crGrayBorder">
      <div className="crInnerMainArea">
        <div className="crUpsideArea crGrayBorder">
          <div className="crUpLeftSideArea crGrayBorder">
            <div className="crUpLeftSide2Area crGrayBorder">
              <div className="crUp2Area1 crUp2Area">
                <p className="crUp2AreaP">살인</p>
                <div className="crUp2AreaSmall"></div>
              </div>
              <div className="crUp2Area2 crUp2Area">
                <p className="crUp2AreaP">폭행</p>
                <div className="crUp2AreaSmall"></div>
              </div>
            </div>
            <div className="crStrongCrimeArea crGrayBorder">
              <p>강력범죄 차트</p>
              <div className="crStrongCrimeGraph">graphArea</div>
              <div className="crStrongCrimeChart"></div>
            </div>
          </div>
          <div className="crUpRightSideArea crGrayBorder">
            <p>마약범죄</p>
            <div>graphArea</div>
          </div>
        </div>
        <div className="crDownSideArea crGrayBorder">
          <div className="crDownSideBox">
            <p className="crDownSideBoxText">지능범죄 차트</p>
            <div className="crDownSideAreaGraphBox">
              <div className="crDownSideBoxTextP">
                <p>해당지역</p>
                <p>경기도</p>
              </div>
              <div className="crDownSideAreaGraph"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrimeReportPage;
