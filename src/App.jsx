import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreateQuiz from "./pages/CreateQuiz";
import TakeQuiz from "./pages/TakeQuiz";
import Results from "./pages/Results";
import "./App.css"; // сюда мы вынесем стили

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="nav-logo">
            <Link to="/">QuizMaker</Link>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/create">Create Quiz</Link>
            <Link to="/quiz/:id">Take Quiz</Link>
            <Link to="/results">Results</Link>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: "80px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/quiz/:id" element={<TakeQuiz />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
