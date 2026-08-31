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
const HubPostEditPage = lazy(() =>
  import("@/pages/HubPostEditPage").then((m) => ({ default: m.HubPostEditPage })),
);
const AdminDashboardPage = lazy(() =>
  import("@/pages/AdminDashboardPage").then((m) => ({
    default: m.AdminDashboardPage,
  })),
);
const PlaceEditPage = lazy(() =>
  import("@/pages/PlaceEditPage").then((m) => ({ default: m.PlaceEditPage })),
);
const InfoPage = lazy(() =>
  import("@/pages/InfoPage").then((m) => ({ default: m.InfoPage })),
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
              <Route path="/students-hub/:id/edit" element={<HubPostEditPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/places/:slug/edit" element={<PlaceEditPage />} />
              <Route
                path="/about"
                element={
                  <InfoPage
                    title="About Huye Finds"
                    intro="Huye Finds helps students and visitors quickly discover useful places, trusted recommendations, and the pulse of campus life in Huye."
                    sections={[
                      {
                        heading: "What we are building",
                        body: [
                          "We created Huye Finds to make everyday discovery easier: where to eat, study, enjoy a coffee, find a service, or learn what is happening around campus.",
                          "The goal is simple: reduce the time spent asking around and make the best local knowledge easier to access and trust.",
                        ],
                      },
                      {
                        heading: "For students and visitors",
                        body: [
                          "Whether you are a new student, a daily commuter, or someone visiting Huye for the first time, the platform is designed to help you move through the city with confidence.",
                          "We focus on practical information, real local experience, and up-to-date recommendations that make campus life easier.",
                        ],
                      },
                      {
                        heading: "Community first",
                        body: [
                          "The Students Hub brings people together around real-time discoveries, events, deals, and conversations that matter on campus.",
                          "This local community layer complements the place listings so the platform feels useful both for planning and for staying connected.",
                        ],
                      },
                    ]}
                    cta={{ label: "Explore the community", href: "/students-hub" }}
                  />
                }
              />
              <Route
                path="/privacy-policy"
                element={
                  <InfoPage
                    title="Privacy Policy"
                    intro="This Privacy Policy explains how Huye Finds handles information when you browse the platform, save favorites, leave reviews, or use the Students Hub."
                    sections={[
                      {
                        heading: "Information we collect",
                        body: [
                          "We may collect basic account information such as your name, email address, and profile details when you create an account or submit content.",
                          "We also collect usage information such as browsing activity, saved favorites, review entries, and interactions with community posts to improve the experience.",
                        ],
                      },
                      {
                        heading: "How we use it",
                        body: [
                          "We use information to provide and improve the service, personalize recommendations, secure accounts, and support community features such as reviews and student posts.",
                          "We do not sell personal data to third parties for marketing purposes.",
                        ],
                      },
                      {
                        heading: "Cookies and analytics",
                        body: [
                          "We may use cookies or analytics tooling to understand how people use the website and improve performance, debugging, and usability.",
                          "You can disable cookies in your browser settings if you prefer, though some parts of the service may be limited as a result.",
                        ],
                      },
                      {
                        heading: "Your choices",
                        body: [
                          "You can choose not to share unnecessary information, update your account details, or contact us to request clarification about your data.",
                          "We review and improve this policy to keep it aligned with the platform and applicable privacy practices.",
                        ],
                      },
                    ]}
                  />
                }
              />
              <Route
                path="/terms"
                element={
                  <InfoPage
                    title="Terms of Service"
                    intro="These Terms of Service describe the basic rules for using Huye Finds and participating in the community."
                    sections={[
                      {
                        heading: "Use of the platform",
                        body: [
                          "You may use Huye Finds for lawful purposes and to discover local places, services, and community updates relevant to life in Huye.",
                          "You are responsible for the accuracy of information you submit, including reviews, posts, and place listings.",
                        ],
                      },
                      {
                        heading: "Community content",
                        body: [
                          "Users are expected to behave respectfully and avoid posting abusive, misleading, defamatory, spammy, or harmful content.",
                          "We may remove content that violates these expectations or that damages the trust of the community.",
                        ],
                      },
                      {
                        heading: "Service availability",
                        body: [
                          "Huye Finds is provided as a service and may be updated, maintained, or limited from time to time.",
                          "We work to keep the platform useful and reliable, but we cannot guarantee uninterrupted access or the completeness of all information published by users.",
                        ],
                      },
                    ]}
                  />
                }
              />
              <Route
                path="/contact"
                element={
                  <InfoPage
                    title="Contact"
                    intro="If you want to ask a question, share feedback, collaborate, or report a problem, we are happy to hear from you."
                    sections={[
                      {
                        heading: "Reach out",
                        body: [
                          "Email: hello@huyefinds.com",
                          "General support: bricebyiringiro@gmail.com",
                          "GitHub: https://github.com/Brice-art",
                        ],
                      },
                      {
                        heading: "What to include",
                        body: [
                          "Please include a short description of your request, the issue or idea, and any relevant context so we can respond faster.",
                          "We appreciate partnership ideas, bug reports, and community suggestions that help improve the experience for students in Huye.",
                        ],
                      },
                    ]}
                    cta={{ label: "Email the team", href: "mailto:hello@huyefinds.com" }}
                  />
                }
              />
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
