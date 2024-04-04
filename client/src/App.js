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
import SettingsPage from 'scenes/settingsPage';
import SinglePostPage from 'scenes/singlePostPage';
import SearchPage from "./scenes/SearchPage";
import PageExplorePage from "./scenes/pageExplorePage";
import PageCreationPage from "./scenes/pageCreationPage";
import PagePage from "./scenes/pagePage";
import PageSettingsPage from "./scenes/pageSettingsPage";


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
          <Route path="/settings" element={isAuth ? <SettingsPage /> : <Navigate to="/"/>}/>
          <Route path="/post/:userId/:postId" element={isAuth ? <SinglePostPage/> : <Navigate to="/"/>}/>
          <Route path="/search" element={<SearchPage />} /> {/* Home and Profile are protected */}
          <Route path="/page" element={ isAuth ? <PageExplorePage /> : <Navigate to="/"/>} />
          <Route path="/page/create" element={ isAuth ? <PageCreationPage /> : <Navigate to="/"/>} />
          <Route path="/page/:pageId" element={ isAuth ? <PagePage /> : <Navigate to="/"/>} />
          <Route path="page/:pageId/settings" element={ isAuth ? <PageSettingsPage /> : <Navigate to="/"/>} />
        </Routes>
      </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
