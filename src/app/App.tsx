import { useEffect, useState } from "react";
import SignUpScreen from "./components/SignUpScreen";
import LoginScreen from "./components/LoginScreen";
import HomeScreen from "./components/HomeScreen";
import TournamentDetailsScreen from "./components/TournamentDetailsScreen";
import TournamentLocationScreen from "./components/TournamentLocationScreen";
import MyTeamsScreen from "./components/MyTeamsScreen";
import ProfileScreen from "./components/ProfileScreen";
import PaymentScreen from "./components/PaymentScreen";
import AdminDashboard from "./components/AdminDashboard";
import Sidebar from "./components/Sidebar";
import ChatScreen from "./components/ChatScreen";
import {
  getProfileApi,
  loginApi,
  logoutApi,
  type AuthResponse,
} from "./services/api";
import { Screen, User, Tournament } from "./types";

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    // Try to load profile if token already exists (persisted login)
    const token = localStorage.getItem("token");
    if (!token) return;
    getProfileApi()
      .then((profile) => {
        // Adapt profile user to App User type (ensure id is number)
        const appUser: User = {
          id: profile.user.id || (profile.user as any).userId,
          email: profile.user.email,
          fullName: profile.user.fullName,
          role: profile.user.role as 'admin' | 'user'
        };
        setCurrentUser(appUser);
        if (appUser.role === 'admin') {
          setCurrentScreen("admin");
        } else {
          setCurrentScreen("home");
        }
      })
      .catch((e) => {
        console.error(e);
        localStorage.removeItem("token");
        localStorage.removeItem("currentUserId");
      });
  }, []);

  const navigateTo = (screen: Screen, data?: any) => {
    if (screen === 'admin') {
      if (currentUser?.role !== 'admin') {
        alert("Admin Access Only");
        return;
      }
      const pin = prompt("Enter Admin PIN:");
      if (pin !== "0111") {
        alert("Incorrect PIN");
        return;
      }
    }

    if (screen === "tournamentDetails" && data?.tournament) {
      setSelectedTournament(data.tournament);
    }
    setCurrentScreen(screen);
  };

  const applyAuthResponse = (auth: AuthResponse) => {
    // Construct user object from flat AuthResponse
    const user: User = {
      id: auth.userId,
      email: auth.email,
      fullName: auth.fullName,
      role: auth.role as 'admin' | 'user',
    };
    setCurrentUser(user);
    if (auth.role === 'admin') {
      navigateTo("admin");
    } else {
      navigateTo("home");
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const auth = await loginApi({ email, password });
      applyAuthResponse(auth);
    } catch (error) {
      alert("Login failed. Please check your email and password.");
    }
  };

  const handleLogout = () => {
    logoutApi();
    setCurrentUser(null);
    setCurrentScreen("login");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "signup":
        return <SignUpScreen onNavigateToLogin={() => navigateTo("login")} />;
      case "login":
        return <LoginScreen onLogin={handleLogin} onNavigateToSignUp={() => navigateTo("signup")} />;
      case "home":
        return <HomeScreen user={currentUser} onNavigate={navigateTo} />;
      case "tournamentDetails":
        return <TournamentDetailsScreen tournament={selectedTournament} onNavigate={navigateTo} />;
      case "tournamentLocation":
        return <TournamentLocationScreen tournament={selectedTournament} onNavigate={navigateTo} />;
      case "myTeams":
        return <MyTeamsScreen onNavigate={navigateTo} />;
      case "profile":
        return <ProfileScreen user={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      case "payment":
        return <PaymentScreen tournament={selectedTournament} onNavigate={navigateTo} />;
      case "admin":
        return <AdminDashboard />;
      case "chat":
        return <ChatScreen user={currentUser} onNavigate={navigateTo} />;
      default:
        return <LoginScreen onLogin={handleLogin} onNavigateToSignUp={() => navigateTo("signup")} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {currentUser && !["login", "signup"].includes(currentScreen) ? (
        <div className="flex">
          <Sidebar
            currentScreen={currentScreen}
            onNavigate={navigateTo}
            onLogout={handleLogout}
            userName={currentUser.fullName}
            userRole={currentUser.role}
          />
          <div className="ml-64 flex-1">
            <div className="container mx-auto px-8 py-6 max-w-7xl">
              {renderScreen()}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md">
            {renderScreen()}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;