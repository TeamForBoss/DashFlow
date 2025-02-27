// import LineChart from "../features/accidentStatus/LineChart";
import { useEffect, useRef, useState } from "react";
import LineChart from "../features/accidentStatus/LineChart";
import DonutChart from "../features/accidentStatus/DonutChart";
import CircularChart from "../features/accidentStatus/CircularChart";
import BarChart from "../features/accidentStatus/BarChart";
import Header from "../components/Header";
import PrintBtn from "../components/PrintBtn.js";
import car_front_fillcolor from "../assets/images/icons/accident/car_front_fillcolor.png";
import heartbeat from "../assets/images/icons/accident/heartbeat.png";

import { hostState } from "../state/hostAtom.js";
import { selectedRegionState } from "../state/atom";
import { useRecoilValue } from "recoil";

interface totalAccident {
  [key: string]: string[] | undefined;

  std_year: string[]; // 기준년도 (예: 2023)
  acc_cl_nm: string[]; // 사고분류명 (예: 전체사고)
  sido_sgg_nm: string[]; // 시도시군구명 (예: 경기도 포천시)
  acc_cnt: string[]; // 사고건수 (예: 652)
  acc_cnt_cmrt: string[]; // 사고건수 구성비 (예: 0.33)
  dth_dnv_cnt: string[]; // 사망자수 (예: 15)
  dth_dnv_cnt_cmrt: string[]; // 사망자수 구성비 (예: 0.59)
  ftlt_rate: string[]; // 치사율 (예: 2.30)
  injpsn_cnt: string[]; // 부상자수 (예: 1112)
  injpsn_cnt_cmrt: string[]; // 부상자수 구성비 (예: 0.39)
  tot_acc_cnt: string[]; // 총사고건수 (예: 198296)
  tot_dth_dnv_cnt: string[]; // 총사망자수 (예: 2551)
  tot_injpsn_cnt: string[]; // 총부상자수 (예: 283799)
  pop_100k?: string[]; // 인구10만명당사고건수 (예: 412.68) [옵션]
  car_10k?: string[]; // 자동차1만대당사고건수 (예: 59.71) [옵션]
  cnt_027_01?: string[]; // 과속 법규위반 사고건수 (예: 0) [옵션]
  cnt_027_02?: string[]; // 중앙선 침범 사고건수 (예: 43) [옵션]
  cnt_027_03?: string[]; // 신호위반 사고건수 (예: 66) [옵션]
  cnt_027_04?: string[]; // 안전거리 미확보 사고건수 (예: 65) [옵션]
  cnt_027_05?: string[]; // 안전운전 의무 불이행 사고건수 (예: 380) [옵션]
  cnt_027_06?: string[]; // 교차로 통행방법 위반 사고건수 (예: 32) [옵션]
  cnt_027_07?: string[]; // 보행자 보호의무 위반 사고건수 (예: 21) [옵션]
  cnt_027_99?: string[]; // 기타 법규위반 사고건수 (예: 45) [옵션]
  cnt_014_01?: string[]; // 차대사람 사고건수 (예: 75) [옵션]
  cnt_014_02?: string[]; // 차대차 사고건수 (예: 551) [옵션]
  cnt_014_03?: string[]; // 차량단독 사고건수 (예: 26) [옵션]
  cnt_014_04?: string[]; // 철길건널목 사고건수 (예: 0) [옵션]
}

export interface ByAccTypeData {
  [key: string]: number | string;
  type: string;
  death: number;
  acc: number;
}
export interface ByCarTypeData {
  name: string;
  value: number;
}

export interface ByYearTypeData {
  [key: string]: number | string;
  year: string;
  acc: number;
  death: number;
  inj: number;
}

const AccidentStatusPage = () => {
  const host = useRecoilValue(hostState);
  const region = useRecoilValue<string>(selectedRegionState);

  // const canvasWrap = useRef<HTMLCanvasElement>(null);
  const [allData, setAllData] = useState<{ data: totalAccident[] }[]>([]);
  const [acData, setAcData] = useState<totalAccident[]>([]);
  const [gugun, setGugun] = useState("");
  const [byAccType, setByAccType] = useState<ByAccTypeData[]>([]);
  const [cntPeople, setCntPeople] = useState<number[]>([]);
  const [carCar, setCarCar] = useState<ByCarTypeData[]>([]);
  const [violOfLaw, setViolOfLaw] = useState<ByCarTypeData[]>([]);
  const [byYearType, setByYearType] = useState<ByYearTypeData[]>([]);
  // console.log(region)
  // console.log(allData)
  const printRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setGugun(region);
  }, []);
  useEffect(() => {
    // fetch('/tempData/accident_data_2023.json')
    fetch(`${host}/accident/city`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ city: region }),
    })
      .then((response) => response.json())
      .then((datas) => {
        const dataLen = datas.length - 1;
        const { city, data } = datas[dataLen];
        if (gugun == city) {
          const { item: dataArr } = data;
          setAcData(dataArr);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // const yearArr = [];
    // let year = new Date().getFullYear() - 2;
    // for (let i = 0; i < 14; i++) {
    //     yearArr.push(year);
    //     --year;
    // }
    //  fetch(`${host}/accident/city`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ city: region }),
    //     })
    //     .then(response => response.json())
    //     .then((datas: []) => {
    //           datas.forEach((items) => {
    //         const { city, sido, data: { item: dataArr} } = items;
    //         if (gugun == city) {
    //             // console.log(dataArr[0].std_year[0])
    //             // console.log(dataArr[0]);
    //             setAllData(prev => [...prev, dataArr[0]]);
    //         }
    //      })
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });

    const travel = (datas: []) => {
      if (allData.length == 0) {
        datas.forEach((items) => {
          const {
            city,
            data: { item: dataArr },
          } = items;
          if (gugun == city) {
            // console.log(dataArr[0].std_year[0])
            // console.log(dataArr[0]);
            setAllData((prev) => [...prev, dataArr[0]]);
          }
        });
      }
    };
    const fetchJson = async () => {
      try {
        // const response = await fetch(`/tempData/accident_data_${year}.json`);
        const response = await fetch(`${host}/accident/city`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ city: region }),
        });
        const json = await response.json();
        await travel(json);
      } catch (err) {
        console.log(err);
      }
    };
    // yearArr.forEach((year) => {
    fetchJson();
    // })
  }, [gugun]);
  ///////////////////////////////////////////
  useEffect(() => {
    const selectedData = allData.map(
      (allAc: any) => {
        return {
          year: allAc.std_year[0], //allAc.data[0].acc_cnt[0]
          acc: Number(allAc.acc_cnt[0]),
          death: Number(allAc.dth_dnv_cnt[0]),
          inj: Number(allAc.injpsn_cnt[0]),
        };
      }
    ); // end of map
    // console.log(selectedData);
    selectedData.sort((a, b) =>
      a.year < b.year ? -1 : a.year > b.year ? 1 : 0
    );
    setByYearType(selectedData);
  }, [allData]);

  useEffect(() => {
    if (acData.length != 0) {
      // 사고종류별 사망, 사고
      const typeData = [];
      for (let obj of acData) {
        if (obj.acc_cl_nm[0] != "전체사고") {
          if (
            obj.acc_cl_nm[0] != "개인형이동수단(PM)사고" &&
            obj.acc_cl_nm[0] != "스쿨존내어린이사고"
          ) {
            typeData.push({
              type: obj.acc_cl_nm[0],
              death: Number(obj.acc_cnt[0]),
              acc: Number(obj.dth_dnv_cnt[0]),
            });
          }
        } else {
          // 사고건수, 사망자수
          const peoples = [Number(obj.acc_cnt), Number(obj.dth_dnv_cnt)];
          setCntPeople(peoples);
          // 사고유형별 사고건수
          const names = ["차대사람", "차대차", "차량단독", "철길건널목"];
          const carPeople = names.map((name, idx) => {
            let carKey = `cnt_014_0${idx + 1}`;
            return { name: name, value: Number(obj[carKey]) };
          });
          setCarCar(carPeople);
          // 법규위반 사고건수
          const lawName = [
            "과속",
            "중앙선 침범",
            "신호위반",
            "안전거리 미확보",
            "안전운전 의무 불이행",
            "교차로 통행방법 위반",
            "보행자 보호의무 위반",
            "기타 법규위반",
          ];
          const lawType = lawName.map((name, idx) => {
            let carKey = `cnt_027_0${idx + 1}`;
            if (idx == 7) {
              carKey = `cnt_027_99`;
            }
            return { name: name, value: Number(obj[carKey]) };
          });
          setViolOfLaw(lawType);
        } // end of if
      } // end of for
      setByAccType(typeData);
    } // end of if
  }, [acData]);
  // console.log(violOfLaw);

  return (
    <>
      <Header page={"accident"} />
      <section id="accident" className="accident">
        <div className="accWrap" ref={printRef}>
          <div className="accGraphWrap">
            <div className="acYearBox">
              <div className="acYearTitle">
                <p>연도별 사망, 사고</p>
              </div>
              <div className="acYearGraph">
                <LineChart yearData={byYearType} />
              </div>
            </div>
            <div className="acTrafficBox">
              <div className="TrafficTitle">
                <p>사고분류별 사망, 사고</p>
              </div>
              <div className="TrafficGraph">
                <BarChart accData={byAccType} />
              </div>
            </div>
          </div>

          <div className="accChartWrap">
            <div className="acCount">
              <div className="numOfAccBox">
                <div className="acAccTitle">
                  <img className="accImg" src={car_front_fillcolor} />
                  <p>사고건수</p>
                </div>
                <div className="accCont">
                  <div className="numOfAcc">{cntPeople[0]}</div>
                </div>
              </div>
              <div className="numOfDeathBox">
                <div className="acDeathTitle">
                  <img className="deathImg" src={heartbeat} />
                  <p>사망자수</p>
                </div>
                <div className="deathCont">
                  <div className="numOfDeath">{cntPeople[1]}</div>
                </div>
              </div>
            </div>
            <div className="accidentType">
              <div className="acTypeBox">
                <div className="acTypeTitle">
                  <p>사고유형별 사고건수</p>
                </div>
                <div className="acTypeGraph">
                  <DonutChart carData={carCar} />
                </div>
              </div>
            </div>
            <div className="LawViolation">
              <div className="acLawBox">
                <div className="acLawTitle">
                  <p>법규위반 사고건수</p>
                </div>
                <div className="acLawGraph">
                  <CircularChart lawData={violOfLaw} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <PrintBtn printRef={printRef} />
      </section>
    </>
  );
};

export default AccidentStatusPage;
