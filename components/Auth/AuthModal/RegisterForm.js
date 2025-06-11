// components/Auth/AuthModal/RegisterForm.jsx
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import config from "@/config";

const RegisterForm = ({ onSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Manage error state internally

  const handleRegistration = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Auto-login after successful registration
      const loginResult = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: config.auth.callbackUrl || '/',
      });
      
      if (loginResult?.error) {
        setError("Registration successful! Please sign in manually");
        onSwitchToLogin();
      } else {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h3 className="font-bold text-2xl text-center mb-6 text-base-content">
        <span className="text-primary">{config.appName}</span> Register
      </h3>
      
      <form onSubmit={handleRegistration} className="space-y-4">
        {/* Error message display */}
        {error && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <div>
          <label htmlFor="reg-name" className="block text-sm font-medium text-base-content mb-1">Name</label>
          <input 
            type="text" 
            id="reg-name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            placeholder="Your Name" 
            className="input input-bordered w-full rounded-md" 
          />
        </div>
        
        <div>
          <label htmlFor="reg-email" className="block text-sm font-medium text-base-content mb-1">Email</label>
          <input 
            type="email" 
            id="reg-email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="your@email.com" 
            className="input input-bordered w-full rounded-md" 
          />
        </div>
        
        <div>
          <label htmlFor="reg-password" className="block text-sm font-medium text-base-content mb-1">Password</label>
          <input 
            type="password" 
            id="reg-password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            minLength={6}
            placeholder="Create Password" 
            className="input input-bordered w-full rounded-md" 
          />
        </div>
        
        <div>
          <label htmlFor="reg-confirmPassword" className="block text-sm font-medium text-base-content mb-1">Confirm Password</label>
          <input 
            type="password" 
            id="reg-confirmPassword" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            minLength={6}
            placeholder="Confirm Password" 
            className="input input-bordered w-full rounded-md" 
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary w-full mt-6 rounded-md" 
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : "Sign Up"}
        </button>
      </form>
      
      <p className="text-center text-sm mt-6 text-base-content">
        Already have an account?{' '}
        <button 
          onClick={() => {
            setError('');
            onSwitchToLogin();
          }} 
          className="link link-primary font-medium"
        >
          Sign In
        </button>
      </p>
    </>
  );
};

export default RegisterForm;