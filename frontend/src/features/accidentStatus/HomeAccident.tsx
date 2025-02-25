import { useRecoilValue } from 'recoil';
import ambulance from '../../assets/images/icons/accident/ambulance.png';
import warning from '../../assets/images/icons/accident/warning.png';

import { hostState } from "../../state/hostAtom";
import { selectedRegionState } from "../../state/atom"; 
import { useEffect, useState } from 'react';

const HomeAccident = () => {
    // console.log(hostState)
    const host:string = useRecoilValue(hostState);
    const region = useRecoilValue(selectedRegionState);
    const [data, setData] = useState([0,0]);
    useEffect(()=>{
        fetch(`${host}/accident`,{
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({city: region})
        })
        .then(res=>res.json())
            .then((data) => {
                for (let key in data) {
                    if (key == "2023") { 
                        // console.log(data[key]);
                        const [{ city: _city, data: { item: arr } }] = data[key];
                        console.log(arr)
                        const acc = Math.round(Number(arr[0].tot_acc_cnt[0])/31);
                        const dth = Math.round(Number(arr[0].tot_dth_dnv_cnt[0]) / 31);
                        setData([ acc, dth ])
                    }
                }
            });
    }, [host]);
    console.log(data)

    return (
    <div className="averageWrap">
        <div className="waveContainer waveAccident">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
        </div>
        <div className="item homeAccidentItem">
        <div className="title">경기 사고 통계 평균</div>

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