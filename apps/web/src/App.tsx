import { BrowserRouter, Route, Routes } from 'react-router';
import AboutPage from './pages/About';
import HomePage from './pages/Home';

import './global.css';

function App() {
  // Render
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/about' element={<AboutPage />} />
    </Routes>
  );
}
function Providers() {
  // Render
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default Providers;
