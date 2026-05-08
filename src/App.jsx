import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AppProvider, useAppContext } from "./helpers/ContextApi";
import AnatomyQuestionGenerator from "./pages/AnatomyQuestionGenerator";
import Question from "./pages/Question";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SubjectSelection from "./pages/SubjectSelection";
import Header from "./Elements/Header";
import Footer from "./Elements/Footer";
import LandingPage from "./pages/LandingPage";
import AnsweredQuestions from "./pages/AnsweredQuestions";

function AppContent() {
  const { isAuthenticated, hasSelectedInstitution, hasSubscriptionAccess } =
    useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !hasSelectedInstitution) {
      navigate("/app");
    }
    // eslint-disable-next-line
  }, [isAuthenticated, hasSelectedInstitution]);

  return (
    <>
      <Header />
      <main className="App-main">
        <Routes>
          <Route
            path="/"
            element={
              !isAuthenticated ? <LandingPage /> : <Navigate to="/app" />
            }
          />
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/app" />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register /> : <Navigate to="/app" />}
          />
          <Route
            path="/anatomy"
            element={
              isAuthenticated && hasSubscriptionAccess && hasSelectedInstitution ? (
                <>
                  <AnatomyQuestionGenerator />
                  <Question />
                </>
              ) : isAuthenticated ? (
                <Navigate to="/app" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/app"
            element={
              isAuthenticated ? <SubjectSelection /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/answered-questions"
            element={
              isAuthenticated ? <AnsweredQuestions /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <div className="App">
        <AppContent />
      </div>
    </AppProvider>
  );
}

export default App;
