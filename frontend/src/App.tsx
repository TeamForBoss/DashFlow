import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// === 공통 컴포넌트 === 
import Header from "./components/Header";

// === 페이지 === 
import Home from "./pages/Home";
import CrimeReportPage from "./pages/CrimeReportPage";
import AccidentStatusPage from "./pages/AccidentStatusPage";
import WeatherInfoPage from "./pages/WeatherInfoPage";

const App = () => {
  return (
    <Router>
      <Header />
      <main id="main">
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/crime-report" element={<CrimeReportPage />} />
          <Route path="/accident-status" element={<AccidentStatusPage />} />
          <Route path="/weather-info" element={<WeatherInfoPage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
