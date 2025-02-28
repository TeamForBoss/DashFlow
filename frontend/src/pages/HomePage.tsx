import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useLocation } from "react-router-dom";

import RegionArea from "../features/home/RegionArea.tsx";
import SeoulArea from "../features/home/SeoulArea.tsx";
import IncheonArea from "../features/home/IncheonArea.tsx";
import AverageArea from "../features/home/AverageArea.tsx";
import Header from "../components/Header.tsx";

import { selectedSectionState } from "../state/selectAtom.js";

const HomePage = () => {
    const currentSido = useRecoilValue(selectedSectionState);
    const location = useLocation();
    
// ==============
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
// ==============
    // 추가: 지역 상태 관리
    const [area, setArea] = useState(null);

    useEffect(() => {
        const region = location.state?.id;
        if (region) {
            setArea(region);
        }
    }, [location.state?.id]); // 의존성 배열 추가

    return (
        <>
            <Header page={"home"} />
            <div className="homeArea">
                <div className="homeContentslayout">
                    {
                        (() => {
                            switch (currentSido) {
                                case "seoul":
                                    return <SeoulArea />;
                                    break;
                                case "gyeonggi":
                                    return <RegionArea />;
                                    break;
                                case "incheon":
                                    return <IncheonArea />;
                                    break;
                            }
                        })()
                    }
                    <AverageArea />
                </div>
            </div>
        </>
    );
};

export default HomePage;
