'use client';

import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>genOS</h1>
          <p>Content Factory</p>
        </div>
        <LoginForm />
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--cds-background-inverse) 0%, #262626 100%);
        }
        .login-container {
          background: white;
          padding: 3rem;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 400px;
        }
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-header h1 {
          font-size: 2.5rem;
          font-weight: 600;
          color: var(--cds-text-primary);
          margin: 0;
        }
        .login-header p {
          color: var(--cds-text-secondary);
          margin: 0.5rem 0 0;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}
