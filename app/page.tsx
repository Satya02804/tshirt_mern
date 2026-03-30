import React from 'react';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' }}>
      {/* Header */}
      <div style={{ padding: '2rem', textAlign: 'center', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          T-Shirt Store
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
          Modern E-Commerce Platform with Advanced Admin Dashboard
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', color: 'white' }}>
        {/* Project Overview */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Project Overview
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                title: 'Frontend (React + Vite)',
                description: 'Modern React application with Vite bundler, Material-UI components, and responsive design.',
                path: '/frontend'
              },
              {
                title: 'Backend (Node.js + Express)',
                description: 'RESTful API with authentication, role-based access control, and database integration.',
                path: '/backend'
              },
              {
                title: 'Admin Dashboard',
                description: 'Professional admin panel with roles & permissions, product management, and analytics.',
                path: '/frontend/src/pages/Dashboard'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  padding: '2rem',
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                  {item.title}
                </h3>
                <p style={{ opacity: 0.85, lineHeight: 1.6, marginBottom: '1rem' }}>
                  {item.description}
                </p>
                <code style={{
                  fontSize: '0.85rem',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  display: 'block',
                  overflow: 'auto'
                }}>
                  {item.path}
                </code>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Key Features
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {[
              '✓ Role-Based Access Control',
              '✓ Permission Management',
              '✓ Product Catalog Management',
              '✓ Order Processing',
              '✓ User Management',
              '✓ Dashboard Analytics',
              '✓ Modern UI/UX Design',
              '✓ Responsive Design',
              '✓ RESTful API',
              '✓ JWT Authentication',
              '✓ Input Validation',
              '✓ Error Handling'
            ].map((feature, idx) => (
              <div key={idx} style={{ fontSize: '1.05rem', opacity: 0.9 }}>
                {feature}
              </div>
            ))}
          </div>
        </section>

        {/* Getting Started */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Getting Started
          </h2>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Frontend Setup</h3>
            <pre style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              padding: '1rem',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '0.9rem'
            }}>
{`cd frontend
npm install
npm run dev

# Runs on http://localhost:5173`}
            </pre>
          </div>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '12px',
            padding: '2rem'
          }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Backend Setup</h3>
            <pre style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              padding: '1rem',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '0.9rem'
            }}>
{`cd backend
npm install
npm start

# Runs on http://localhost:5000
# API: http://localhost:5000/api`}
            </pre>
          </div>
        </section>

        {/* Recent Improvements */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Latest Frontend Updates
          </h2>
          <div style={{
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '2rem'
          }}>
            <ul style={{ lineHeight: 1.8, opacity: 0.95, marginLeft: '1.5rem' }}>
              <li>Professional blue & gray color scheme with modern Material-UI theme</li>
              <li>Redesigned admin sidebar with better navigation and visual hierarchy</li>
              <li>Enhanced Roles & Permissions page with role cards and permission matrix</li>
              <li>Improved dashboard with metrics, charts, and recent activity</li>
              <li>Modern styling across all dashboard pages (Products, Orders, Users)</li>
              <li>Updated Header and Footer with gradient backgrounds and smooth animations</li>
              <li>Better responsive design for mobile and desktop</li>
              <li>Improved typography, spacing, and visual consistency</li>
            </ul>
          </div>
        </section>

        {/* Project Structure */}
        <section>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Project Structure
          </h2>
          <pre style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '2rem',
            borderRadius: '12px',
            overflow: 'auto',
            fontSize: '0.85rem',
            lineHeight: 1.6
          }}>
{`tshirtstore/
├── frontend/                    # React + Vite Application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   └── Dashboard/      # Admin dashboard pages
│   │   ├── components/         # Reusable components
│   │   ├── contexts/           # React contexts (Auth, Cart)
│   │   ├── services/           # API services
│   │   ├── hooks/              # Custom hooks
│   │   └── utils/              # Utility functions
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Node.js + Express Application
│   ├── src/
│   │   ├── models/             # Database models
│   │   ├── controllers/        # Route controllers
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Auth & permission middleware
│   │   └── utils/              # Helper functions
│   ├── package.json
│   └── server.js
│
└── README.md`}
          </pre>
        </section>
      </div>

      {/* Footer */}
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        opacity: 0.8,
        marginTop: '4rem'
      }}>
        <p>© 2024 T-Shirt Store. Built with React, Node.js, and Material-UI.</p>
      </div>
    </main>
  );
}
