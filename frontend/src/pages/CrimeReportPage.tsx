import React, { useEffect, useRef, useState } from "react";
import PrintBtn from "../components/PrintBtn"; // PrintBtn
import StrongDataToGraph from "../features/crimeReport/StrongDataToGraph";
import ViolenceCrimeDataToGraph from "../features/crimeReport/ViolenceCrimeDataToGraph";
import IntelligenceCrimeDataToGraph from "../features/crimeReport/IntelligenceCrimeDataToGraph";
import useCrimeData from "../features/crimeReport/useCrimeData";
import knifeImg from "../assets/images/icons/crime/knife_gray.png";
import handImg from "../assets/images/icons/crime/boom_hand.png";
import Header from "../components/Header";
import useReloadOnRoute from "./useReloadOnRoute";
const CrimeReportPage: React.FC = () => {
  useReloadOnRoute("/crime-report");
  const printRef = useRef<HTMLDivElement>(null); // PrintBtn 할때 필요 한 것!!!
  const { strongCrimeData, violenceCrimeData } = useCrimeData();
  const [strongNum, setStrongNum] = useState<number | null>(null);
  const [violenceNum, setViolenceNum] = useState<number | null>(null);

  useEffect(() => {
    if (!strongCrimeData || strongCrimeData.length === 0) return;
    const killPersonData = strongCrimeData.filter((value: any) =>
      value.범죄중분류.includes("살인기수")
    );
    const violencePersonData = violenceCrimeData.filter((value: any) =>
      value.범죄중분류.includes("폭행")
    );

    if (killPersonData.length > 0) {
      setStrongNum(killPersonData[0].data);
      setViolenceNum(violencePersonData[0].data);
    }
  }, [strongCrimeData, violenceCrimeData]);

  return (
    <>
      <section className="crMainWrapper" ref={printRef}>
        <Header page={"crime"} />
        <section id="crMainArea" className="crMainArea crGrayBorder">
          <div className="crInnerMainArea">
            <div className="crUpsideArea crGrayBorder">
              <div className="crUpLeftSideArea crGrayBorder">
                <div className="crUpLeftSide2Area crGrayBorder">
                  <div className="crUp2Area1 crUp2Area">
                    <img className="mainImg" src={knifeImg}></img>
                    <p className="crUp2AreaP">
                      <span>살인</span>
                    </p>
                    <div className="crUp2AreaSmall">
                      <p>{strongNum}</p>
                    </div>
                  </div>
                  <div className="crUp2Area2 crUp2Area">
                    <img className="mainImg" src={handImg}></img>
                    <p className="crUp2AreaP">
                      <span>폭행</span>
                    </p>
                    <div className="crUp2AreaSmall">
                      <p>{violenceNum?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="crStrongCrimeArea crGrayBorder">
                  <p className="crChartName">강력범죄 차트</p>
                  <div className="crStrongCrimeGraph">
                    <StrongDataToGraph />
                  </div>
                </div>
              </div>
              <div className="crUpRightSideArea crGrayBorder">
                <p className="crChartName">폭력범죄 차트</p>
                <div className="crUpRightGraph">
                  <ViolenceCrimeDataToGraph />
                </div>
              </div>
            </div>
            <div className="crDownSideArea crGrayBorder">
              <div className="crDownSideBox">
                <p className="crChartName">지능범죄 차트</p>
                <div className="crDownSideAreaGraph">
                  <IntelligenceCrimeDataToGraph />
                </div>
              </div>
            </div>
          </div>
        </section>
        <PrintBtn printRef={printRef} /> {/* PrintBtn 할 때 필요 한 것!!!*/}
      </section>
    </>
  );
};

export default CrimeReportPage;
