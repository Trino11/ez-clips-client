import { useState } from 'react';
import './App.css';
import About from './modules/about/components/About';
import Header from './modules/header/components/Header';
import Home from './modules/home/components/Home';
import LoginWithDiscord from './modules/login/components/LoginWithDiscord';
import UpdateModal from './modules/updates/components/UpdateModal';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
  }
}

function App() {
  const [text, setText] = useState('Hello World');

  return (
    <Router>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <UpdateModal />
        <p>API Url: {import.meta.env.VITE_API_URL}</p>
        <LoginWithDiscord />
        <button onClick={() => setText(window.location.href)}>
          Change Text
        </button>
        <p>{text}</p>
      </main>
    </Router>
  );
}

export default App;
