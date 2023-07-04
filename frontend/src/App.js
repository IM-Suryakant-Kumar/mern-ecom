import React from "react";
import "./App.css";
import Header from "./components/layout/Header.js";
import { BrowserRouter } from "react-router-dom";
import webFont from "webfontloader";

function App() {

  React.useEffect(() => {
    webFont.load({
      google: {
        families: ["Roboto", "Droid sans", "Chilanka"]
      }
    })
  }, [])

	return (
		<BrowserRouter>
      <Header />
    </BrowserRouter>
	)
}

export default App
