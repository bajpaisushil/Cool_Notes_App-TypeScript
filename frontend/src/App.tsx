import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import LoginModal from './components/loginModal';
import NavBar from './components/navbar';
import SignUpModal from './components/signUpModal';
import { User } from './models/user';
import * as NotesApi from "./network/notes_api";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotePage from './components/pages/notesPage';
import PrivatePage from './components/pages/privatePage';
import NotFoundPage from './components/pages/notFoundPage';
import styles from "./styles/app.module.css";


function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await NotesApi.getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }
  })

  return (
    <BrowserRouter>
    <div>
      <NavBar loggedInUser={loggedInUser} onLogInClicked={() => setShowLoginModal(true)} onSignUpClicked={() => setShowSignUpModal(true)} onLogoutSuccessful={() => setLoggedInUser(null)} />

      <Container className={styles.pageContainer}>
        <Routes>
          <Route path="/" element={<NotePage loggedInUser={loggedInUser} /> } />
          <Route path='/privacy' element={<PrivatePage />} />
          <Route path='/*' element={<NotFoundPage />} />
        </Routes>
      </Container>
      {showSignUpModal &&
        <SignUpModal onDismiss={() => setShowSignUpModal(false)} onSignUpSuccessful={(user) => { setLoggedInUser(user); setShowSignUpModal(false); }} />
      }
      {showLoginModal &&
        <LoginModal onDismiss={() => setShowLoginModal(false)} onLoginSuccessful={(user) => { setLoggedInUser(user); setShowLoginModal(false) }} />
      }
    </div>
    </BrowserRouter>
  );
}

export default App;
