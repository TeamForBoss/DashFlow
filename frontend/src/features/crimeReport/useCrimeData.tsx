import { useEffect, useState } from "react";
import crimeData from "../../assets/tempData/crime_data.json";
import crimeDataAll from "../../assets/tempData/crime_api_data.json";

const useCrimeData = () => {

  const [strongCrimeData, setStrongCrimeData] = useState<
    { data: number; 범죄대분류: string; 범죄중분류: string }[]
  >([]);
  const [violenceCrimeData, setViolenceCrimeData] = useState<
    { data: number; 범죄대분류: string; 범죄중분류: string }[]
  >([]);
  const [intelligenceCrimeData, setIntelligenceCrimeData] = useState<
    { data: number; 범죄대분류: string; 범죄중분류: string }[]
  >([]);
  const [allCrimeData, setAllCrimeData] = useState(null);

  useEffect(() => {
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

    // ================================== 이부분 오류 떠서 일단 주석 처리 했어요 (유진) ==================================
    /*
    const allAvgData = crimeDataAll.filter((value: any) => {
      for (let key in value) {
        if (typeof value[key] === "string" && value[key].includes("지능")) {
          const arr: [] = [];
          value.forEach((v, i, a) => {});
          return { data: 0, 범죄대분류: "지능범죄", 범죄중분류: "하이" };
        }
      }
      return false;
    });

    console.log(allAvgData);
    // 경기도 전체 지역 지능 범죄~~~
    setAllCrimeData(allAvgData);
    console.log(intelligenceData);

    */
    // ================================== 이부분 오류 떠서 일단 주석 처리 했어요 (유진) ==================================

    setStrongCrimeData(strongData);
    setViolenceCrimeData(violenceData);
    setIntelligenceCrimeData(intelligenceData);
  }, []);

  return {
    allCrimeData,
    strongCrimeData,
    violenceCrimeData,
    intelligenceCrimeData,
  };
};

export default useCrimeData;
