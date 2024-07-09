import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


import classes from './Header.module.css'

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { getDatabase, ref, onValue, update, set, push} from "firebase/database";

const Header = () => {
    const [user, setUser] = useState([]);
    const [auth, setAuth] = useState(false);
    const [showProfileInf, setShowProfileInf] = useState(false);
    const [username, setUsername] = useState(null);
    const [newUserName, setNewUserName] = useState('');
    const [changeNick, setChangeNick] = useState(false);
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
            if(user){
                setUser(user);
                setAuth(true);
                getUsername();
            }
            else{
                setUser(null);
                setAuth(false)
            }
        })
    },[user])

    const getUsername = () =>{
        const dbRealTime = getDatabase();
        const starCountRef = ref(dbRealTime, 'users/' + user.uid);
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          console.log(data.username)
          setUsername(data.username);
          setNewUserName(data.username);
        });
    }

    const signOut = () =>{
        firebase.auth().signOut()
    }
    
    const changeNickname = () =>{
        const dbRealTime = getDatabase();
        const nicknameRef = ref(dbRealTime, 'users/' + user.uid);
        update(nicknameRef,{
            email: user.email,
            username: newUserName?newUserName:'',
        })
    }

    return (
        <header>
            <div onClick={()=>{setShowProfileInf(!showProfileInf)}} style={showProfileInf ? {display: 'flex'} : {}} className={classes.overlay}></div>
            <div className={classes.logo}>
                <Link to="/" className={classes.logo__1}>fantq</Link>
                <span className={classes.logo__2}>w2g</span>
            </div>
            <div className={classes.right}>
                {auth ? (
                    <img onClick={()=>{setShowProfileInf(!showProfileInf)}} className={classes.avatar} src={user.photoURL}/>
                ):(
                    <Link to='/login' className={classes.noAvatar_link}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" className={`icon ${classes.noAvatar}`}><path d="M480-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM160-160v-94q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5t127.921 44.694q31.301 14.126 50.19 40.966Q800-292 800-254v94H160Zm60-60h520v-34q0-16-9.5-30.5T707-306q-64-31-117-42.5T480-360q-57 0-111 11.5T252-306q-14 7-23 21.5t-9 30.5v34Zm260-321q39 0 64.5-25.5T570-631q0-39-25.5-64.5T480-721q-39 0-64.5 25.5T390-631q0 39 25.5 64.5T480-541Zm0-90Zm0 411Z"/></svg>
                    </Link>
                )}
            </div>
            <div className={classes.profile_info} style={showProfileInf ? {top: '8vh'} : {}}>
                <div className={classes.profile_info_container}>
                    <div className={classes.nickname}>
                        {!changeNick ?(
                            <div>
                                {user && username}
                                <svg onClick={()=>{setChangeNick(true)}} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M180-180h44l443-443-44-44-443 443v44Zm614-486L666-794l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Zm-107-21-22-22 44 44-22-22Z"/></svg>
                            </div>
                        ):(
                            <div>
                                <input type="text" value={username} onChange={(e)=>{setNewUserName(e.target.value)}}/>
                                <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z"/></svg>
                            </div>
                        )
                        }
                    </div>
                    <div>Ваш UID:</div>
                    <div className={classes.uid}>{user && user.uid}</div>
                    <button onClick={signOut} className={classes.signout_button}>SignOut</button>
                </div>
            </div>
        </header>
    );
};

export default Header;