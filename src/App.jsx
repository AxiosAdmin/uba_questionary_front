import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AppProvider, useAppContext } from "./helpers/ContextApi";
import AnatomyQuestionGenerator from "./pages/AnatomyQuestionGenerator";
import Question from "./pages/Question";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import SubjectSelection from "./pages/SubjectSelection";
import Header from "./Elements/Header";
import Footer from "./Elements/Footer";
import LanguageSelector from "./Elements/LanguageSelector";
import LandingPage from "./pages/LandingPage";
import AnsweredQuestions from "./pages/AnsweredQuestions";
import Feedback from "./pages/Feedback";

function AppContent() {
  const { isAuthenticated, hasSelectedInstitution, hasSubscriptionAccess } =
    useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const shouldRedirectAuthenticatedUser =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  useEffect(() => {
    if (
      isAuthenticated &&
      !hasSelectedInstitution &&
      shouldRedirectAuthenticatedUser
    ) {
      navigate("/app");
    }
    // eslint-disable-next-line
  }, [isAuthenticated, hasSelectedInstitution, shouldRedirectAuthenticatedUser]);

  return (
    <>
      <div className="app-toolbar">
        <LanguageSelector />
      </div>
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
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
          <Route
            path="/feedback"
            element={isAuthenticated ? <Feedback /> : <Navigate to="/login" />}
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
