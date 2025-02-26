import RegionArea from '../features/home/RegionArea.tsx';
import AverageArea from '../features/home/AverageArea.tsx';
import Header from '../components/Header.tsx';
import SeoulArea from '../features/home/SeoulArea.tsx';
import IncheonArea from '../features/home/IncheonArea.tsx';
import { useState } from 'react';
const HomePage = (props) => {
    const [area, setArea] = useState("gyeonggi");
    
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
