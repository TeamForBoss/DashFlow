import { useEffect, useState } from "react";
import crimeDataAll from "../../assets/tempData/crime_api_data.json";

/////////////////////////////////
/// 라우팅 관련 test 2025.02.24
import { useRecoilValue } from "recoil";
import { hostState } from "../../state/hostAtom.js"; // host 주소
import { selectedRegionState } from "../../state/atom.js"; // 지역 값
/// 라우팅 관련 test 2025.02.24
/////////////////////////////////

const useCrimeData = () => {
  const [data, setData] = useState<any>([]);
  const [crimeData, setCrimeData] = useState<any>(null);
  const host = useRecoilValue(hostState); // 리코일_호스트
  const region = useRecoilValue(selectedRegionState); // 리코일_지역값
  useEffect(() => {
    fetch(`${host}/crime`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error("API 요청 오류!!!:", error));
  }, [host]);

  useEffect(() => {
    fetch(`${host}/crime/city`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: region }), /// 변동사항 ** 지역값 추가**
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCrimeData(data);
      });
  }, [host, region]);

  const [strongCrimeData, setStrongCrimeData] = useState<
    { data: number; 범죄대분류: string; 범죄중분류: string }[]
  >([]);
  const [violenceCrimeData, setViolenceCrimeData] = useState<
    { data: number; 범죄대분류: string; 범죄중분류: string }[]
  >([]);
  const [intelligenceCrimeData, setIntelligenceCrimeData] = useState<
    { data: number; 범죄대분류: string; 범죄중분류: string }[]
  >([]);
  const [allCrimeData, setAllCrimeData] = useState<
    { data: number; 범죄대분류: string; 범죄중분류: string }[]
  >([]);

  useEffect(() => {
    if (!crimeData || !crimeData["crimeData"]) return;
    const crimeArray = crimeData["crimeData"];
    const strongData = crimeArray.filter((value: any) => {
      for (let key in value) {
        if (typeof value[key] === "string" && value[key].includes("강력")) {
          return true;
        }
      }
      return false;
    });
    const violenceData = crimeArray.filter((value: any) => {
      for (let key in value) {
        if (typeof value[key] === "string" && value[key].includes("폭력")) {
          return true;
        }
      }
      return false;
    });
    const intelligenceData = crimeArray.filter((value: any) => {
      for (let key in value) {
        if (typeof value[key] === "string" && value[key].includes("지능")) {
          return true;
        }
      }
      return false;
    });

    const allAvgData = data.filter((value: any) => {
      for (let key in value) {
        if (typeof value[key] === "string" && value[key].includes("지능")) {
          return true;
        }
      }
      return false;
    });
    let avgData = allAvgData.map((value) => {
      let total = 0;
      let count = 0;
      for (let key in value) {
        if (key.includes("경기도")) {
          total += value[key];
          count++;
        }
      }
      return {
        data: count > 0 ? Math.round(total / count) : 0,
        범죄대분류: value["범죄대분류"],
        범죄중분류: value["범죄중분류"],
      };
    });

    console.log(avgData);
    // console.log(intelligenceData);
    // 경기도 전체 지역 지능 범죄~~~
    // console.log(allAvgData);
    setAllCrimeData(avgData);
    // console.log(intelligenceData);

    setStrongCrimeData(strongData);
    setViolenceCrimeData(violenceData);
    setIntelligenceCrimeData(intelligenceData);
  }, [crimeData]);

  return {
    allCrimeData,
    strongCrimeData,
    violenceCrimeData,
    intelligenceCrimeData,
  };
};

export default useCrimeData;
