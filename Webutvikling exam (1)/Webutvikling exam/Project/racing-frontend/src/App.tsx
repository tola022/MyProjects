import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Driver from './components/Driver';
import Team from './components/Team';
import Races from './components/Race';
import "./App.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import Fun from './components/Funny/Fun';

const App: React.FC = () => (
  <Router>
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#FF1801' }}>
        <div className="container">
          <Link to="/" className="navbar-brand text-white">
            Formula Race Event
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/drivers" className="nav-link text-white">
                  Drivers
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/teams" className="nav-link text-white">
                  Teams
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/races" className="nav-link text-white">
                  Races
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/fun" className="nav-link text-white">
                  Fun
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/drivers" element={<Driver/>} />
        <Route path="/teams" element={<Team />} />
        <Route path="/races" element={<Races />} />
        <Route path="/fun" element={<Fun/>} />
      </Routes>

    </div>
    </Router>
);

export default App;
