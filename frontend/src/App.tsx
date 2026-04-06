import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/useAuth";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import MyPosts from "./pages/MyPosts";
import EditPost from "./pages/EditPost";
import UserProfile from "./pages/UserProfile";
import UserPosts from "./pages/UserPosts";
import SavedPosts from "./pages/SavedPosts";
import LikedPosts from "./pages/LikedPosts";

function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header style={{ display: "flex", gap: 12, padding: 12 }}>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/my-profile">MyProfile</Link>
      <Link to="/register">Register</Link>
      <Link to="/posts/create">CreatePost</Link>
      <Link to="/my/posts">MyPosts</Link>
      <Link to="/saved-posts">SavedPosts</Link>
      <Link to="/liked-posts">LikedPosts</Link>
      {isAuthenticated && <button onClick={() => void logout()}>Logout</button>}
    </header>
  );
}

function AppRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        <Route path="/users/:userId/posts" element={<UserPosts />} />

        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my/posts"
          element={
            <ProtectedRoute>
              <MyPosts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/:postId/edit"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-posts"
          element={
            <ProtectedRoute>
              <SavedPosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/liked-posts"
          element={
            <ProtectedRoute>
              <LikedPosts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}