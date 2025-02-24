import RegionArea from '../features/home/RegionArea.tsx';
import AverageArea from '../features/home/AverageArea.tsx';
import Header from '../components/Header.tsx';
const HomePage = () => {
  return (
    <>
    <Header page={"home"}/>
    <div className="homeArea">
      <div className="homeContentslayout">
        <RegionArea />
        <AverageArea />
      </div>
    </div>
    </>
  );
};

export default HomePage;
