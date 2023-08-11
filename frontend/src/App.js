import React from "react";
import "./App.css";
import {
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
	Route
} from "react-router-dom";
import webFont from "webfontloader";
import Layout from "./components/layouts/Layout";
import Home from "./components/Home/Home";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path="/"
			element={<Layout />}
		>
			<Route
				index
				element={<Home />}
			/>
		</Route>
	)
);

function App() {
	React.useEffect(() => {
		webFont.load({
			google: {
				families: ["Roboto", "Droid sans", "Chilanka"]
			}
		});
	}, []);

	return <RouterProvider router={router} />;
}

export default App;
