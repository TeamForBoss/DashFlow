import { useRecoilValue } from 'recoil';
import sunny from '../../assets/images/icons/weather/sun.png';

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
                const [{ city: _city, data: { item: arr } }] = data;
                // console.log(arr[0].tot_acc_cnt[0])
                const acc = Math.round(Number(arr[0].tot_acc_cnt[0])/31);
                const dth = Math.round(Number(arr[0].tot_dth_dnv_cnt[0]) / 31);
                setData([ acc, dth ])
        });
    }, [host]);

    return (
    <div className="averageWrap">
        <div className="waveContainer waveAccident">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
        </div>
        <div className="item homeAccidentItem">
        <div className="title">경기도 범죄</div>
        <div className="contents">
            <div className="content">
            <img src={sunny} alt="맑음" />
            <div className="info">
                            <span className="value">{ data[0]+"명"}</span>
                <span className="text">사고</span>
            </div>
            </div>
            <div className="content">
            <img src={sunny} alt="습도" />
            <div className="info">
                            <span className="value">{ data[1]+"명"}</span>
                <span className="text">사망</span>
            </div>
            </div>
        </div>
        </div>
    </div>
    )
}

export default HomeAccident;