
const AccidentStatusPage = () => {
    return(
        <section id="accident" className="accident">
            <div className="accGraphWrap">
                <div className="acYearBox">
                    <div className="acYearTitle">
                        <p>조회년도별 사망, 사고</p>
                    </div>
                    <div className="acYearGraph">1233
                    </div> 
                </div>
                <div className="acTrafficBox">
                    <div className="TrafficTitle">
                        <p>사고분류별 사망, 사고</p>
                    </div>
                    <div className="TrafficGraph">123123</div>
                </div>
            </div>

            <div className="accChartWrap">
                <div className="acCount">
                    <div className="numOfDeathBox">
                        <div className="acDeathTitle">
                            <p>사망자수</p>
                        </div>
                        <div className="numOfDeath">43</div>
                    </div>
                   <div className="numOfAccBox">
                        <div className="acAccTitle">
                            <p>사고건수</p>
                        </div>
                        <div className="numOfAcc">25</div>
                    </div>
                </div>
                <div className="accidentType">
                    <div className="acTypeBox">
                        <div className="acTypeTitle">
                            <p>사고유형별 사고건수</p>
                        </div>
                        <div className="acTypeGraph">123213</div>
                    </div>
                </div>
                <div className="LawViolation">
                    <div className="acLawBox">
                        <div className="acLawTitle">
                            <p>법규위반 사고건수</p>
                        </div>
                        <div className="acLawGraph">1231</div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AccidentStatusPage;