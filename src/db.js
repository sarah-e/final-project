import firebase from 'firebase'

firebase.initializeApp({
  apiKey: "AIzaSyA6FoHVXYmSIswV51C1VxXNnFUvcqL09i4",
  authDomain: "js2-project.firebaseapp.com",
  databaseURL: "https://js2-project.firebaseio.com",
  storageBucket: "js2-project.appspot.com",
  messagingSenderId: "740249786233"
})

export default firebase.database()
