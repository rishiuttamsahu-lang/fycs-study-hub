import { User, LogOut } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Profile() {
  const { user, login, logout } = useApp();
  
  // Helper to get initials
  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : "U";
  
  // If user is not logged in
  if (!user) {
    return (
      <div className="p-5 pt-8 max-w-md mx-auto">
        <div className="glass-card p-8 text-center">
          <User size={48} className="mx-auto mb-4 text-white/30" />
          <div className="font-bold text-lg mb-2">Please Login</div>
          <div className="text-white/55 text-sm mb-6">You need to be logged in to view your profile.</div>
          
          <button
            type="button"
            onClick={async () => {
              try {
                await login();
              } catch (error) {
                console.error('Login error:', error);
              }
            }}
            className="w-full py-3 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/20 border border-white/20 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 1.76-1.77 3.12-3.77 3.12-2.29 0-4.14-1.86-4.14-4.15s1.85-4.15 4.14-4.15c1.11 0 2.08.41 2.81 1.19l2.06-2.06c-1.27-1.19-2.88-1.92-4.87-1.92-4.02 0-7.29 3.27-7.29 7.29s3.27 7.29 7.29 7.29c3.68 0 6.74-2.69 6.74-7.29 0-.58-.1-1.14-.2-1.67z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }
  
  // User is logged in - show profile
  return (
    <div className="p-5 pt-8 max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Profile</h2>
        <p className="text-white/55 text-xs mt-1">Your FYCS Study Hub account.</p>
      </div>

      <div className="glass-card p-6">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName} 
              className="w-24 h-24 rounded-full border-2 border-white/20 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
              <span className="text-4xl font-bold text-white/80">
                {getInitials(user.displayName)}
              </span>
            </div>
          )}
        </div>

        {/* User Details */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">{user.displayName || "User"}</h1>
          <p className="text-white/60 mb-4">{user.email}</p>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          }}
          className="w-full py-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-xl font-medium hover:bg-red-500/30 transition-colors"
        >
          <div className="flex items-center justify-center gap-2">
            <LogOut size={18} />
            Sign Out
          </div>
        </button>
      </div>
    </div>
  );
}

