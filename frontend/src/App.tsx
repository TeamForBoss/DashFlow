import React from "react"

import Header from "./components/Header";
import Footer from "./components/Footer";
import AccidentStatusPage from "./pages/AccidentStatusPage";

const App = () => {
    return (
    <>
        <Header />
        <main id="main">
            <AccidentStatusPage />
        </main>
        <Footer />
    </>
  )
}

export default App;
