import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/lib/AuthContext";
import { AppLayout } from "@/router/AppLayout";
import { LandingPage } from "@/pages/LandingPage";
import { HomePage } from "@/pages/HomePage";
import { BrowsePage } from "@/pages/BrowsePage";
import { PlaceDetailsPage } from "@/pages/PlaceDetailsPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { FavoritesPage } from "@/pages/FavoritesPage";
import { ComingSoonPage } from "@/pages/ComingSoonPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/places/:slug" element={<PlaceDetailsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/housing"
              element={
                <ComingSoonPage
                  title="Housing listings"
                  emoji="🏠"
                  description="Browse student-friendly rooms and apartments near campus — launching in a future update."
                />
              }
            />
            <Route
              path="/account"
              element={
                <ComingSoonPage
                  title="Student accounts"
                  emoji="🎓"
                  description="Full profile management is on the roadmap. For now, sign in to save favorites and leave reviews."
                />
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
