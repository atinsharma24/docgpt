import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Route, Link } from 'react-router-dom';

import DocumentUpload from './components/DocumentUpload';
import AskDocument from './components/AskDocument';
import TestView from './components/TestView';

export default function App() {
	return (
		<Router>
			<nav>
				<Link to="/">Upload Document</Link> | {' '}
				<Link to="/ask">Ask Question</Link> | {' '}
				<Link to="/test">Test API</Link>
			</nav>
			<hr />

			<Routes>
				<Route path="/upload" element={<DocumentUpload />} />
				<Route path="/ask" element={<AskDocument />} />
				<Route path="/test" element={<TestView />} />
				<Route path="*" element={<div>Welcome! Choose a page.</div>} />
			</Routes>

		</Router>

	);
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <Router>
//           <nav>
//             <ul>
//               <li>
//                 <Link to="/">Upload Document</Link>
//               </li>
//               <li>
//                 <Link to="/ask">Ask Question</Link>
//               </li>
//               <li>
//                 <Link to="/test">Test API</Link>
//               </li>
//             </ul>
//           </nav>

//           <Route path="/" exact component={DocumentUpload} />
//           <Route path="/ask" component={AskDocument} />
//           <Route path="/test" component={TestView} />
//         </Router>
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
