import { useRecoilValue } from 'recoil';
import ambulance from '../../assets/images/icons/accident/ambulance.png';
import warning from '../../assets/images/icons/accident/warning.png';

import { hostState } from "../../state/hostAtom";
import { selectedRegionState } from "../../state/atom"; 
import { selectedSectionState } from "../../state/selectAtom";
import { useEffect, useState } from 'react';

const HomeAccident = () => {
    // console.log(hostState)
    const host:string = useRecoilValue(hostState);
    const region = useRecoilValue(selectedRegionState);
    const area = useRecoilValue<string>(selectedSectionState);
    const [data, setData] = useState(["0", 0]);
    const [currentSido, setCurrentSido] = useState<string>(area);
    console.log(area)
    const matchingSido: { [key:string] : string } = {
		seoul : "서울시",
		gyeonggi : "경기도",
		incheon: "인천시",
    }
    // console.log(data)
    useEffect(() => {
        // setCurrentSido(area);
        fetch(`${host}/accident/city`,{
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({city: region})
        })
        .then(res=>res.json())
            .then((datas) => {
                console.log(datas)
                const dataLen = datas.length - 1;
                const { city, data, sido } = (datas[dataLen]);
                const { item: dataArr } = data;
                let acc:string = "0";
                let dth = 0;
                switch (area) {
                    case "gyeonggi":
                        acc = (Math.round(Number(dataArr[0].tot_acc_cnt[0]) / 31)).toString()
  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                        dth = (Math.round(Number(dataArr[0].tot_dth_dnv_cnt[0]) / 31));
                        setData([acc, dth]);
                        break;
                    case "seoul":
                        acc = (Math.round(Number(dataArr[0].tot_acc_cnt[0]) / 24)).toString()
  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                        dth = Math.round(Number(dataArr[0].tot_dth_dnv_cnt[0]) / 24);
                        setData([acc, dth]);
                        break;
                     case "incheon":
                        acc = Math.round(Number(dataArr[0].tot_acc_cnt[0]) / 9).toString()
  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                        dth = Math.round(Number(dataArr[0].tot_dth_dnv_cnt[0]) / 9);
                        setData([acc, dth]);
                        break;
                }
            });
    }, [host]);
    // console.log(data)

    return (
    <div className="averageWrap">
        <div className="waveContainer waveAccident">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
        </div>
        <div className="item homeAccidentItem">
                <div className="title">{matchingSido[ currentSido ] } 사고 연평균</div>
        <div className="acAvgInfoText">2023년 기준 평균 데이터</div>
        <div className="contents">
            <div className="content">
            <img src={warning} alt="사고" />
            <div className="info">
                <span className="text">사고</span>
                            <span className="value">{ data[0]+"명"}</span>
            </div>
            </div>
            <div className="content">
            <img src={ambulance} alt="사망" />
            <div className="info">
                <span className="text">사망</span>
                            <span className="value">{ data[1]+"명"}</span>
            </div>
            </div>
        </div>
        </div>
    </div>
    )
}

export default HomeAccident;