import './App.css';
import About from './modules/about/components/About';
import Header from './modules/header/components/Header';
import Home from './modules/home/components/Home';
import UpdateModal from './modules/updates/components/UpdateModal';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <UpdateModal />
      </main>
    </Router>
  );
}

export default App;
