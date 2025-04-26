import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile';
import Chat from './components/chat/Chat';
import ChatList from './components/chat/ChatList';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';

// Context
import AuthState from './context/auth/AuthState';
import AlertState from './context/alert/AlertState';
import ProfileState from './context/profile/ProfileState';
import ChatState from './context/chat/ChatState';
import Alert from './components/layout/Alert';

const App = () => {
  return (
    <AuthState>
      <ProfileState>
        <ChatState>
          <AlertState>
            <Router>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-6">
                  <Alert />
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    } />
                    <Route path="/edit-profile" element={
                      <PrivateRoute>
                        <EditProfile />
                      </PrivateRoute>
                    } />
                    <Route path="/chats" element={
                      <PrivateRoute>
                        <ChatList />
                      </PrivateRoute>
                    } />
                    <Route path="/chat/:id" element={
                      <PrivateRoute>
                        <Chat />
                      </PrivateRoute>
                    } />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </AlertState>
        </ChatState>
      </ProfileState>
    </AuthState>
  );
};

export default App;
