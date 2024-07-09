import React, { useEffect, useState } from 'react';
import classes from './Login.module.css'
import { useNavigate } from 'react-router-dom';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const Login = () => {
    const [auth, setAuth] = useState(false);
    const navigate = useNavigate();

    const firebaseConfig = {
        apiKey: "AIzaSyCxVh1JsLTRMXSLipjB3QSwRqd2o7N6FaA",
        authDomain: "fantqw2g.firebaseapp.com",
        databaseURL: "https://fantqw2g-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "fantqw2g",
        storageBucket: "fantqw2g.appspot.com",
        messagingSenderId: "1093154126781",
        appId: "1:1093154126781:web:c5624592aa67d6a83df0d4",
        measurementId: "G-VBDDXQSXD4"
    };
  
  
    firebase.initializeApp(firebaseConfig);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) =>{
            user && setAuth(true);
            console.log(user)
        })
    },[])

    useEffect(()=>{
        if(auth){
            navigate('/')
        }
    },[auth])

    const signInGoogle = () =>{
        const authProvider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(authProvider)
          .then((userCredential) => {
            setAuth(true)
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
          });
    }

    return (
        <div className={classes.loginPage_container}>
            <div className={classes.login_container}>
                <div className={classes.login_box}>
                    <form>
                        <input type="email" placeholder='E-mail' />
                        <input type="password" placeholder='Password' />
                        <button>SignIn</button>
                    </form>
                    <p>- Or Sign in width -</p>
                    <button className={classes.signInGoogle} onClick={signInGoogle}>
                        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="30px" height="30px">    <path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z"/></svg>
                        Google
                    </button>
                </div>
                <div className={classes.register_box}>
                    <form>
                        
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;