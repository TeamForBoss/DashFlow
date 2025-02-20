import React from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
// import AccidentStatusPage from "./pages/AccidentStatusPage";
import CrimeReportPage from "./pages/CrimeReportPage";

const App = () => {
  return (
    <>
      <Header />
      <main id="main">
        <CrimeReportPage />
      </main>
      <Footer />
    </>
  );
};

export default App;
