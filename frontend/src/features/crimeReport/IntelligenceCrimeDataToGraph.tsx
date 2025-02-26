import useCrimeData from "../../features/crimeReport/useCrimeData";
import IntelligenceCrimeLineChart from "../../features/crimeReport/IntelligenceCrimeLineChart"; // 라인 차트 컴포넌트

const IntelligenceCrimeDataToGraph = () => {
  const { intelligenceCrimeData, allCrimeData, selected } = useCrimeData();

  return (
    <IntelligenceCrimeLineChart
      data1={intelligenceCrimeData}
      data2={allCrimeData}
      data3={selected}
    />
  );
};

export default IntelligenceCrimeDataToGraph;
