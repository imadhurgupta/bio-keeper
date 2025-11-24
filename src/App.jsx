import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateBio from './pages/CreateBio';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import ViewBio from './pages/ViewBio';

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        {/* Main layout container with flex column and minimum height */}
        <div className="flex flex-col min-h-screen bg-gray-50">
          
          <Navbar />

          {/* Main content area expands to fill available space */}
          <main className="flex-grow">
            <Routes>
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              <Route path="/" element={<Login />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/create" 
                element={
                  <ProtectedRoute>
                    <CreateBio />
                  </ProtectedRoute>
                } 
              />
              <Route 
              path="/view/:id"
              element={
              <ProtectedRoute>
                <ViewBio />
                </ProtectedRoute>
              } 
              />
            
            </Routes>
          </main>

          {/* Footer stays at the bottom */}
          <Footer />
          
        </div>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;