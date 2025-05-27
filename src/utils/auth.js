import firebase from 'firebase/app';
import 'firebase/auth';

const signIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/calendar.events');
  provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
  provider.setCustomParameters({ prompt: 'select_account consent' });

  return firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      const { accessToken: token } = result.credential;
      const { user } = result;
      console.log('OAuth Token:', token);
      console.log('Firebase User:', user);
      return { user, token };
    })
    .catch((error) => {
      console.error('Error during sign-in:', error);
      throw error;
    });
};

const signOut = () =>
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log('User signed out.');
    })
    .catch((error) => {
      console.error('Error during sign-out:', error);
      throw error;
    });

const onAuthStateChanged = (callback) => firebase.auth().onAuthStateChanged(callback);

export { signIn, signOut, onAuthStateChanged };
