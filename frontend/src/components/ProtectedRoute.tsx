import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";//children
import { useAuth } from "../contexts/useAuth";

export default function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <p>Loading now</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}