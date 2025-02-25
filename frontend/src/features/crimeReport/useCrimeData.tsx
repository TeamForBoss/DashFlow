import useCrimeData from "../../features/crimeReport/useCrimeData";
import BarChart from "../../features/crimeReport/BarChart";

const StrongDataToGraph = () => {
  const { strongCrimeData } = useCrimeData();
  return <BarChart data={strongCrimeData} />;
};

export default StrongDataToGraph;
