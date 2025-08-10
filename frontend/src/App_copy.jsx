import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import DocumentUpload from "./components/DocumentUpload";
import AskDocument from "./components/AskDocument"
import TestView from "./components/AskDocument";


export default function App() {
	return (
		<Router>
			<nav>
				<Link to="/">Upload Document</Link> | {' '}
				<Link to="/ask">Ask Question</Link> | {' '}
				<Link to="/test">Test API</Link>
			</nav>

			<Routes>
				<Route path="/" element={<DocumentUpload />} />
				<Route path="/ask" element={<AskDocument />} />
				<Route path="/test" element={<TestView />} />
				<Route path="*" element={<DocumentUpload />} />
			</Routes>
		</Router>
	);
}