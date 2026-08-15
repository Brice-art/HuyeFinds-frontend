import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/lib/AuthContext";
import { AppLayout } from "@/router/AppLayout";
import { LandingPage } from "@/pages/LandingPage";

// Every route below is loaded on demand, not bundled with the app shell.
// Confirmed by a real Lighthouse audit: the landing page was shipping
// ~5.75MB of JavaScript it never used — including the entire
// CreatePlacePage form (menu editor, hours editor, and the Untitled UI
// file-upload library) to every anonymous visitor who just wants to
// browse. Named exports need the .then() mapping since React.lazy()
// requires a default export and these pages intentionally use named
// exports for consistency with the rest of the codebase.
const HomePage = lazy(() =>
  import("@/pages/HomePage").then((m) => ({ default: m.HomePage })),
);
const BrowsePage = lazy(() =>
  import("@/pages/BrowsePage").then((m) => ({ default: m.BrowsePage })),
);
const PlaceDetailsPage = lazy(() =>
  import("@/pages/PlaceDetailsPage").then((m) => ({
    default: m.PlaceDetailsPage,
  })),
);
const LoginPage = lazy(() =>
  import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("@/pages/RegisterPage").then((m) => ({ default: m.RegisterPage })),
);
const ForgotPasswordPage = lazy(() =>
  import("@/pages/ForgotPasswordPage").then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);
const ResetPasswordPage = lazy(() =>
  import("@/pages/ResetPasswordPage").then((m) => ({
    default: m.ResetPasswordPage,
  })),
);
const FavoritesPage = lazy(() =>
  import("@/pages/FavoritesPage").then((m) => ({ default: m.FavoritesPage })),
);
const CreatePlacePage = lazy(() =>
  import("@/pages/CreatePlacePage").then((m) => ({
    default: m.CreatePlacePage,
  })),
);
const ComingSoonPage = lazy(() =>
  import("@/pages/ComingSoonPage").then((m) => ({ default: m.ComingSoonPage })),
);

const StudentsHubPage = lazy(() =>
  import("@/pages/StudentsHubPage").then((m) => ({
    default: m.StudentsHubPage,
  })),
);
const CreateHubPostPage = lazy(() =>
  import("@/pages/CreateHubPostPage").then((m) => ({
    default: m.CreateHubPostPage,
  })),
);

const HubPostDetailPage = lazy(() =>
  import("@/pages/HubPostDetailPage").then((m) => ({
    default: m.HubPostDetailPage,
  })),
);
function RouteLoadingFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/places/:slug" element={<PlaceDetailsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/places/new" element={<CreatePlacePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/students-hub" element={<StudentsHubPage />} />
              <Route path="/students-hub/new" element={<CreateHubPostPage />} />
              <Route path="/students-hub/:id" element={<HubPostDetailPage />} />
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
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
