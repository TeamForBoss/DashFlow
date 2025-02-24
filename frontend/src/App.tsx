import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// === 공통 컴포넌트 === 
import Header from "./components/Header";

// === 페이지 === 
import Home from "./pages/Home";
import HomePage from "./pages/HomePage";


import CrimeReportPage from "./pages/CrimeReportPage";
import AccidentStatusPage from "./pages/AccidentStatusPage";
import WeatherInfoPage from "./pages/WeatherInfoPage";

const App = () => {
  return (
    <Router>
      <main id="main">
      <Header page={"weather"}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/crime-report" element={<CrimeReportPage />} />
          <Route path="/accident-status" element={<AccidentStatusPage />} />
          <Route path="/weather-info" element={<WeatherInfoPage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
