import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";

// === 페이지 ===
import HomePage from "./pages/HomePage";
import CrimeReportPage from "./pages/CrimeReportPage";
import AccidentStatusPage from "./pages/AccidentStatusPage";
import WeatherInfoPage from "./pages/WeatherInfoPage";
import Selection from "./pages/SelectPage";

const App = () => {
  return (
    <RecoilRoot>
      <Router>
        <main id="main">
          <Routes>
            <Route path="/" element={<Selection />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/crime-report" element={<CrimeReportPage />} />
            <Route path="/accident-status" element={<AccidentStatusPage />} />
            <Route path="/weather-info" element={<WeatherInfoPage />} />
          </Routes>
        </main>
      </Router>
    </RecoilRoot>
  );
};   

export default App;