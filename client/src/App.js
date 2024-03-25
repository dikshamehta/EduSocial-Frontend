import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from 'scenes/homePage';
import LoginPage from 'scenes/loginPage';
import ProfilePage from 'scenes/profilePage';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from "./theme";
import AdPage from 'scenes/ADmanagement';


function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]); //Sets up theme
  const isAuth = Boolean(useSelector((state) => state.token)); //Checks if user is logged in - authorized if token exists

  return (
    <div className="app">
      <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={ isAuth ? <HomePage /> : <Navigate to="/"/>} /> {/* If user is not logged in, redirect to login page */}
          <Route path="/profile/:userId" element={ isAuth ? <ProfilePage /> : <Navigate to="/"/>} /> {/* Home and Profile are protected */}
          <Route path="/create-ad" element={isAuth ? <AdPage /> : <Navigate to="/"/>}/>
        </Routes>
      </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;