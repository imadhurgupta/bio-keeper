import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle } from 'lucide-react';

// 1. Import Firestore functions
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'; 
import { db } from '../firebaseConfig';

const Login = () => {
  const { googleSignIn, user, signUp, logIn } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state

  // --- Helper Function: Save User to Firestore ---
  const saveUserToFirestore = async (currentUser) => {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Create new user doc
      await setDoc(docRef, {
        uid: currentUser.uid,
        name: currentUser.displayName || "User", // Fallback for email auth
        email: currentUser.email,
        photoURL: currentUser.photoURL || null,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        role: 'user'
      });
    } else {
      // User exists, just update last login time
      await setDoc(docRef, { 
        lastLogin: serverTimestamp() 
      }, { merge: true });
    }
  };

  // --- Handle Google Sign In ---
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      // 1. Trigger the popup and wait for result
      const result = await googleSignIn();
      
      // 2. Save user to database
      if (result && result.user) {
        await saveUserToFirestore(result.user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      setError("Google Sign-In closed or failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- Handle Email/Password Auth ---
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOG IN ---
        const result = await logIn(email, password);
        // Update last login timestamp
        await saveUserToFirestore(result.user);
      } else {
        // --- SIGN UP ---
        const result = await signUp(email, password);
        // Create new user in database
        await saveUserToFirestore(result.user);
      }
      navigate('/dashboard');
    } catch (err) {
      // Error Handling
      if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-gray-500 mb-6 text-center">
          {isLogin ? 'Enter your details to access your biodata.' : 'Get started with your free account.'}
        </p>

        {/* Error Message Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Manual Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              required 
            />
          </div>
           
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              required 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg font-bold transition shadow-md ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        {/* Google Button */}
        <button 
          onClick={handleGoogleSignIn}
          type="button" // Important to prevent form submission
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition shadow-sm"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          <span className="font-medium">Continue with Google</span>
        </button>

        {/* Toggle Login/Signup */}
        <p className="mt-8 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            className="text-indigo-600 font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>

      </motion.div>
    </div>
  );
};

export default Login;