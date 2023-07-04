import "./App.css";
import Header from "./components/layout/Header.js";
import { BrowserRouter } from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
      <Header />
    </BrowserRouter>
	)
}

export default App
