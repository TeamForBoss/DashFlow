import { useEffect, useState } from 'react';

import RegionArea from '../features/home/RegionArea.tsx';
import SeoulArea from '../features/home/SeoulArea.tsx';
import IncheonArea from '../features/home/IncheonArea.tsx';

import AverageArea from '../features/home/AverageArea.tsx';
import Header from '../components/Header.tsx';
import { useLocation } from 'react-router-dom';

const HomePage = () => {
    const [area, setArea] = useState("gyeonggi");
    const location = useLocation();
    useEffect(() => { 
        const regoin = location.state?.id;
        setArea(regoin)
    })
  return (
    <>
    <Header page={"home"}/>
    <div className="homeArea">
              <div className="homeContentslayout">
                  { area === "gyeonggi" ?  (
                      <RegionArea />
                  ) : area === "seoul" ?(
                      <SeoulArea />     
                  ):(
                      <IncheonArea />
                  )}
            <AverageArea />
      </div>
    </div>
    </>
  );
};

export default HomePage;
