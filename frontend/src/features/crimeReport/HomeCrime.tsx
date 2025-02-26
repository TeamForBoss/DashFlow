import { useEffect, useState } from "react";
import knifeImg from "../../assets/images/icons/crime/knife_gray.png";
import handImg from "../../assets/images/icons/crime/boom_hand.png";
///////////////////////////////////////////////////////
/// 라우팅 걸어가지고 json 가져오자미~
import { useRecoilValue } from "recoil";
import { hostState } from "../../state/hostAtom.js";

///////////////////////////////////////////////////////
const HomeCrime = () => {
  const host = useRecoilValue(hostState);
  const [data, setData] = useState<any>([]);
  const [killNum, setKillNum] = useState(0);
  const [StrongNum, setStrongNum] = useState(0);

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
    const killData = data.filter((value: any) => {
      for (let key in value) {
        if (typeof value[key] === "string" && value[key].includes("살인기수")) {
          //   console.log(value);
          return true;
        }
      }
      return false;
    });
    const strongData = data.filter((value: any) => {
      for (let key in value) {
        if (typeof value[key] === "string" && value[key].includes("폭행")) {
          //   console.log(value);
          return true;
        }
      }
      return false;
    });
    // console.log(killData);
    ////////// 경기도 평균 살인 /////////////////
    killData.forEach((value: any) => {
      let sum = 0;
      let avg = 0;
      //   console.log(value);
      for (let key in value) {
        // console.log(value[key]);
        if (typeof value[key] == "number") {
          avg++;
          sum += Number(value[key]);
        }
      }
      setKillNum(Math.round(sum / avg));
      //   console.log(killNum);
    });

    ////////// 경기도 평균 폭행사건 /////////////////
    strongData.forEach((value: any) => {
      let sum = 0;
      let avg = 0;
      //   console.log(value);
      for (let key in value) {
        // console.log(value[key]);
        if (typeof value[key] === "number") {
          avg++;
          sum += Number(value[key]);
        }
      }
      setStrongNum(Math.round(sum / avg));
      //   console.log(StrongNum);
    });
  }, [data]);

  return (
    <div className="averageWrap">
      <div className="waveContainer waveCrime">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>
      <div className="item homeCrimeItem">
        <div className="title">경기도 범죄 연평균</div>
        <div className="crAvgInfoText">2024년 기준 평균 데이터</div>
        <div className="contents">
          <div className="content">
            <img src={knifeImg} alt="살인" />
            <div className="info">
              <span className="text">살인</span>
              <span className="value">{killNum} 건</span>
            </div>
          </div>
          <div className="content">
            <img src={handImg} alt="폭행" />
            <div className="info">
              <span className="text">폭행</span>
              <span className="value">{StrongNum} 건</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCrime;
