import { useApp } from "../context/AppContext";

export default function Login() {
  const { login } = useApp();
  
  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center">
              <svg className="w-12 h-12 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 1.76-1.77 3.12-3.77 3.12-2.29 0-4.14-1.86-4.14-4.15s1.85-4.15 4.14-4.15c1.11 0 2.08.41 2.81 1.19l2.06-2.06c-1.27-1.19-2.88-1.92-4.87-1.92-4.02 0-7.29 3.27-7.29 7.29s3.27 7.29 7.29 7.29c3.68 0 6.74-2.69 6.74-7.29 0-.58-.1-1.14-.2-1.67z"/>
              </svg>
            </div>
          </div>
          
          {/* Heading */}
          <h1 className="text-3xl font-bold mb-3">Welcome to FYCS Study Hub</h1>
          
          {/* Subtext */}
          <p className="text-white/60 mb-8">
            Your central hub for notes, PYQs, and assignments.
          </p>
          
          {/* Login Button */}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-4 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center gap-3 hover:bg-white/20 border border-white/20 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 1.76-1.77 3.12-3.77 3.12-2.29 0-4.14-1.86-4.14-4.15s1.85-4.15 4.14-4.15c1.11 0 2.08.41 2.81 1.19l2.06-2.06c-1.27-1.19-2.88-1.92-4.87-1.92-4.02 0-7.29 3.27-7.29 7.29s3.27 7.29 7.29 7.29c3.68 0 6.74-2.69 6.74-7.29 0-.58-.1-1.14-.2-1.67z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}