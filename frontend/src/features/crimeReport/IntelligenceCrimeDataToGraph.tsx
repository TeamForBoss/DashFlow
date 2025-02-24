import useCrimeData from "../../features/crimeReport/useCrimeData";
import IntelligenceCrimeBarChart from "../../features/crimeReport/IntelligenceCrimeLineChart"; // 막대 그래프 컴포넌트

const IntelligenceCrimeDataToGraph = () => {
  const { intelligenceCrimeData } = useCrimeData();

  return (
    <div>
      <IntelligenceCrimeBarChart data={intelligenceCrimeData} />
    </div>
  );
};

export default IntelligenceCrimeDataToGraph;
