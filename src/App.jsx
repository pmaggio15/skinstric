import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Testing from "./components/Testing"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <Hero />
          </>
        } />
        <Route path="/testing" element={<Testing />} />
      </Routes>
    </Router>
  )
}