import { useEffect, useRef, useState } from "react";
// import { crimeData } from "../tempData/crime_data.json";
// import * as d3 from "d3";
import StrongDataToGraph from "../features/crimeReport/StrongDataToGraph";
import ViolenceCrimeDataToGraph from "../features/crimeReport/ViolenceCrimeDataToGraph";
import IntelligenceCrimeDataToGraph from "../features/crimeReport/IntelligenceCrimeDataToGraph";
import useCrimeData from "../features/crimeReport/useCrimeData";

const CrimeReportPage = () => {
  // // console.log(strongDataToGraph);
  // const { strongCrimeData } = useCrimeData();
  // // console.log(strongCrimeData);
  // const killPersonData = strongCrimeData.filter((value: any) => {
  //   for (let key in value) {
  //     if (typeof value[key] === "string" && value[key].includes("살인기수")) {
  //       return true;
  //     }
  //   }
  //   return false;
  // });
  // const num = killPersonData[0].data;
  // // console.log(num);

  const { strongCrimeData, violenceCrimeData } = useCrimeData();
  const [strongNum, setStrongNum] = useState<number | null>(null);
  const [violenceNum, setViolenceNum] = useState<number | null>(null);

  useEffect(() => {
    if (!strongCrimeData || strongCrimeData.length === 0) return;
    const killPersonData = strongCrimeData.filter((value: any) => {
      for (let key in value) {
        if (typeof value[key] === "string" && value[key].includes("살인기수")) {
          return true;
        }
      }
      return false;
    });
    const violencePersonData = violenceCrimeData.filter((value: any) => {
      for (let key in value) {
        if (typeof value[key] === "string" && value[key].includes("폭행")) {
          return true;
        }
      }
      return false;
    });

    if (killPersonData.length > 0) {
      setStrongNum(killPersonData[0].data);
      setViolenceNum(violencePersonData[0].data);
    }
  }, [strongCrimeData]);
  return (
    <section id="crMainArea" className="crMainArea crGrayBorder">
      <div className="crInnerMainArea">
        <div className="crUpsideArea crGrayBorder">
          <div className="crUpLeftSideArea crGrayBorder">
            <div className="crUpLeftSide2Area crGrayBorder">
              <div className="crUp2Area1 crUp2Area">
                <p className="crUp2AreaP">살인</p>
                <div className="crUp2AreaSmall">{strongNum}</div>
              </div>
              <div className="crUp2Area2 crUp2Area">
                <p className="crUp2AreaP">폭행</p>
                <div className="crUp2AreaSmall">{violenceNum}</div>
              </div>
            </div>
            <div className="crStrongCrimeArea crGrayBorder">
              <p>강력범죄 차트</p>
              <div className="crStrongCrimeGraph">
                <StrongDataToGraph />
              </div>
            </div>
          </div>
          <div className="crUpRightSideArea crGrayBorder">
            <p>폭력범죄 차트</p>
            <div className="crUpRightGraph">
              <ViolenceCrimeDataToGraph />
            </div>
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
              <div className="crDownSideAreaGraph">
                <IntelligenceCrimeDataToGraph />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrimeReportPage;
