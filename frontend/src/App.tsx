import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// === 공통 컴포넌트 === 
import Header from "./components/Header";
import Footer from "./components/Footer";

// === 페이지 === 
import Home from "./pages/Home";
import SelectorDashboard from "./pages/SelectorDashboard";
import CrimeReportPage from "./pages/CrimeReportPage";
import WeatherInfoPage from "./pages/WeatherInfoPage";
import AccidentStatusPage from "./pages/AccidentStatusPage";
const App = () => {
  return (
    <Router>
      <Header />
      <main id="main">
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<SelectorDashboard />} />
          <Route path="/crime-report" element={<CrimeReportPage />} />
          <Route path="/weather-info" element={<WeatherInfoPage />} />
          <Route path="/accident-status" element={<AccidentStatusPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
