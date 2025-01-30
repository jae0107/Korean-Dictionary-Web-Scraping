'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    const result = await signIn('credentials', {
      username: email,
      password: password,
      redirect: true,
      callbackUrl: '/',
    });
  };

  return (
    <main>
      <h1>Login</h1>
      <div>
        <div>
          <label htmlFor="email">
            Email
          </label>
          <div className="mt-1">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              autoFocus
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="password">
            Password
          </label>
          <div className="mt-1">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSubmit}
          >
            Log In
          </button>
        </div>
      </div>
    </main>
  );
};

export default Login;