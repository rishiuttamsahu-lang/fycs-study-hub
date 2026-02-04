import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

import { useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Login from "./pages/Login";
import Materials from "./pages/Materials";
import Profile from "./pages/Profile";
import Subjects from "./pages/Subjects";
import Upload from "./pages/Upload";
import BannedPage from "./pages/BannedPage";

function App() {
  const { user, loading } = useApp();
  const [isUserBanned, setIsUserBanned] = useState(false);
  const [userDataLoading, setUserDataLoading] = useState(true);

  // Check if user is banned
  useEffect(() => {
    if (!user?.uid) {
      setUserDataLoading(false);
      setIsUserBanned(false);
      return;
    }
    
    const checkBanStatus = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setIsUserBanned(userData.isBanned || false);
        } else {
          setIsUserBanned(false);
        }
      } catch (error) {
        console.error("Error checking ban status:", error);
        setIsUserBanned(false);
      } finally {
        setUserDataLoading(false);
      }
    };
    
    checkBanStatus();
  }, [user?.uid]);
  
  // Loading state
  if (loading || userDataLoading) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }
  
  // Show banned page if user is banned
  if (user && isUserBanned) {
    return <BannedPage />;
  }
  
  // Not logged in
  if (!user) {
    return <Login />;
  }
  
  // Logged in - return the router with all routes
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={
          {
            style: {
              borderRadius: '8px',
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#FACC15', // Yellow-400
                secondary: 'black',
              },
            },
          }
        }
      />
      <div className="bg-[#0a0a0a] text-white pb-24">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/semester/:semId" element={<Subjects />} />
        <Route path="/semester/:semId/:subjectId" element={<Materials />} />
        <Route path="/library" element={<Library />} />
        <Route path="/upload" element={<ProtectedRoute requiredRole="admin"><Upload /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Navbar />
    </div>
    </>
  );
}

export default App;