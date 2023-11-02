import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC3nSu4WOJ-0LbPRK7sjg4sJQkP6XjNkxY",
  authDomain: "react-chess-3f4e1.firebaseapp.com",
  projectId: "react-chess-3f4e1",
  storageBucket: "react-chess-3f4e1.appspot.com",
  messagingSenderId: "234461344231",
  appId: "1:234461344231:web:6b9a865a4b4c684c4e4d42"
};

const app = firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()
export const auth = firebase.auth()
export default firebase