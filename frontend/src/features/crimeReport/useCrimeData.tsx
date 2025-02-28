import { useEffect, useState } from "react";
import crimeDataAll from "../../assets/tempData/crime_api_data.json";

/////////////////////////////////
/// 라우팅 관련 test 2025.02.24
import { useRecoilValue } from "recoil";
import { hostState } from "../../state/hostAtom.js"; // host 주소
import { selectedRegionState } from "../../state/atom.js"; // 지역 값
import { selectedSectionState } from "../../state/selectAtom.js"; // seoul , gyeonggi , incheon
/// 라우팅 관련 test 2025.02.24
/////////////////////////////////

const useCrimeData = () => {
  const [data, setData] = useState<any>([]);
  const [crimeData, setCrimeData] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);

  const host = useRecoilValue(hostState); // 리코일_호스트
  const sectionV = useRecoilValue(selectedSectionState); /// 리코일 _ seoul , gyeonggi , incheon
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
    switch (sectionV) {
      case "seoul":
        // console.log(typeof sectionV);
        setSelected("서울");
        break;
      case "gyeonggi":
        setSelected("경기도");
        break;
      case "incheon":
        setSelected("인천");
        break;
      default:
        setSelected("");
        break;
    }
  }, [host, region, sectionV]);

  useEffect(() => {
    fetch(`${host}/crime/city`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: region }), /// 변동사항 ** 지역값 추가**
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setCrimeData(data);
      });
  }, [host, region, sectionV]);

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

    let tem: { data: number; 범죄대분류: string; 범죄중분류: string }[] = [];

    data.forEach((value: any) => {
      let newCrimeData: any = {};
      let total = 0;
      let count = 0;

      for (let key in value) {
        if (key.includes(selected)) {
          newCrimeData[key] = value[key];
          total += Number(value[key]);
          count++;
        }
      }

      if (value["범죄대분류"] === "지능범죄" && count > 0) {
        // console.log(newCrimeData);

        tem.push({
          data: Math.round(total / count),
          범죄대분류: value["범죄대분류"],
          범죄중분류: value["범죄중분류"],
        });
      }
    });

    // console.log(tem);
    setAllCrimeData(tem);
    setStrongCrimeData(strongData);
    setViolenceCrimeData(violenceData);
    setIntelligenceCrimeData(intelligenceData);
  }, [crimeData, data, selected]);

  return {
    allCrimeData,
    strongCrimeData,
    violenceCrimeData,
    intelligenceCrimeData,
    selected,
  };
};

export default useCrimeData;
