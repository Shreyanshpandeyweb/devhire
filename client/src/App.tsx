import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import PostJobPage from "./pages/PostJobPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Candidate-only route */}
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute roles={["CANDIDATE"]}>
                  <MyApplicationsPage />
                </ProtectedRoute>
              }
            />

            {/* Employer-only route */}
            <Route
              path="/post-job"
              element={
                <ProtectedRoute roles={["EMPLOYER"]}>
                  <PostJobPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
