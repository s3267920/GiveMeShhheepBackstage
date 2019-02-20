import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/firebase-storage';

const config = {
  apiKey: 'AIzaSyCSb1bfu4cMXGkW15bxOa17RQTsiB9DbT4',
  authDomain: 'givemeshhheep.firebaseapp.com',
  databaseURL: 'https://givemeshhheep.firebaseio.com',
  projectId: 'givemeshhheep',
  storageBucket: 'gs://givemeshhheep.appspot.com',
  messagingSenderId: '522608041337',
};

export default firebase.initializeApp(config);
