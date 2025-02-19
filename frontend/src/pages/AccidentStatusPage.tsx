
const AccidentStatusPage = () => {
    return(
        <section id="accident">
            <div className="accGraphWrap">
                <div className="acViewYear">
                    <div className="acYearTitle">
                        <p>조회년도별 사망, 사고</p>
                        </div>
                    <div className="acYearGraph"></div> 
                </div>
                <div className="acTraffic">
                    <div className="TrafficTitle">사고분류별 사망, 사고</div>
                </div>
            </div>

            <div className="accChartWrap"></div>
        </section>
    )
}

export default AccidentStatusPage;