import useCrimeData from "../../features/crimeReport/useCrimeData"; // 데이터 훅 import
import ViolenceCrimeDonutChart from "../../features/crimeReport/ViolenceCrimeDonutChart"; // 도넛 차트 컴포넌트 import

const ViolenceCrimeDataToGraph = () => {
  const { violenceCrimeData } = useCrimeData();

  return <ViolenceCrimeDonutChart />;
};

export default ViolenceCrimeDataToGraph;
