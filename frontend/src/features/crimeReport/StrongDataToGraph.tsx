import useCrimeData from "../../features/crimeReport/useCrimeData";
import BarChart from "../../features/crimeReport/BarChart";

const StrongDataToGraph = () => {
  const { strongCrimeData } = useCrimeData();

  return (
    <div>
      {/* <h2>강력 범죄 데이터</h2> */}
      <BarChart data={strongCrimeData} />
    </div>
  );
};

export default StrongDataToGraph;
