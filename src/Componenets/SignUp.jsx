import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock, FiUser, FiArrowRight, FiLogIn } from 'react-icons/fi';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(
        err.code === 'auth/email-already-in-use' 
          ? 'Email already in use. Please login instead.'
          : 'Password should be at least 6 characters.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to sign up with Google. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#222831] p-4">
      <div className="w-full max-w-md bg-[#393E46] p-8 rounded-xl shadow-2xl border border-[#393E46]/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#EEEEEE] mb-2">Create Account</h2>
          <p className="text-[#b5b5b5]">Join us to get started</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#EEEEEE] mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-[#b5b5b5]" />
              </div>
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-[#222831] border border-[#222831] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] text-[#EEEEEE] placeholder-[#b5b5b5]"
                required
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#EEEEEE] mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-[#b5b5b5]" />
              </div>
              <input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-[#222831] border border-[#222831] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] text-[#EEEEEE] placeholder-[#b5b5b5]"
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-[#EEEEEE] mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-[#b5b5b5]" />
              </div>
              <input 
                id="confirm-password"
                type="password" 
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-[#222831] border border-[#222831] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] text-[#EEEEEE] placeholder-[#b5b5b5]"
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
              loading 
                ? 'bg-[#00ADB5]/70 cursor-not-allowed' 
                : 'bg-[#00ADB5] hover:bg-[#008E9B]'
            } text-[#EEEEEE] transition-colors`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              <>
                Sign Up <FiArrowRight className="ml-2" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#b5b5b5]/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#393E46] text-[#b5b5b5]">Or sign up with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignup}
              disabled={googleLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-[#b5b5b5]/30 rounded-lg shadow-sm text-sm font-medium text-[#EEEEEE] bg-[#222831] hover:bg-[#222831]/80 transition-colors"
            >
              <FcGoogle className="w-5 h-5 mr-3" />
              {googleLoading ? 'Signing up...' : 'Continue with Google'}
            </button>
          </div>
        </div>

        <p className="mt-8 text-sm text-center text-[#b5b5b5]">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#00ADB5] hover:text-[#008E9B] flex items-center justify-center">
            <FiLogIn className="mr-1" /> Login now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;