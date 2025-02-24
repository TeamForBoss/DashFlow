import RegionArea from '../features/home/RegionArea.tsx';
import AverageArea from '../features/home/AverageArea.tsx';

const HomePage = () => {
  return (
    <div className="homeArea">
      <div className="homeContentslayout">
        <RegionArea />
        <AverageArea />
      </div>
    </div>
  );
};

export default HomePage;
