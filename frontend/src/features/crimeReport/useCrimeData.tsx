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
  const [allCrimeData, setAllCrimeData] = useState<
    { data: number; 범죄대분류: string; 범죄중분류: string }[]
  >([]);

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

    const allAvgData = crimeDataAll.filter((value: any) => {
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
          total += (value as Record<string, number | string>)[key] as number;
          count++;
        }
      }
      return {
        data: count > 0 ? Math.ceil(total / count) : 0,
        범죄대분류: value["범죄대분류"],
        범죄중분류: value["범죄중분류"],
      };
    });

    // console.log(avgData);
    // console.log(intelligenceData);
    // 경기도 전체 지역 지능 범죄~~~
    // console.log(allAvgData);
    setAllCrimeData(avgData);
    // console.log(intelligenceData);

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
