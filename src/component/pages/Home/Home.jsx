import React, { useEffect, useState } from 'react';

import classes from './Home.module.css'

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { getDatabase, ref, onValue, update, set, push } from "firebase/database";
import 'firebase/database';

import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const [user, setUser] = useState('');
    const [authorized, setAuthorized] = useState(false);
    const [crRoomPass , setCrRoomPass] = useState(false);
    const [createRoomUrl, setCreateRoomUrl] = useState('');
    const [createRoomPass, setCreateRoomPass] = useState('');
    const [conRoomId, setConRoomId] = useState('');
    const [roomList, setRoomList] = useState([]);
    const [roomListShow, setRoomListShow] = useState(false);
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
        firebase.auth().onAuthStateChanged((user) => {
            user ? setUser(user) : setUser('');
            !user && navigate('/login');
        });
        getRoomsList();
    }, []);

    const connectRoom = () =>{
        navigate(`/room/${conRoomId}`);
    }

    const createRoom = () =>{
        const db = firebase.firestore();
        const collectionRef = db.collection('rooms');

        const roomData = {
            playing: false,
            timing: 0,
            url: createRoomUrl,
            users: [user.uid],
        }

        collectionRef.add(roomData)
        .then((doc)=>{
            if(createRoomPass){
                const roomRefPass = db.collection('withPass').doc(doc.id);
                roomRefPass.set({
                    password: createRoomPass,
                });
            }

            navigate(`/room/${doc.id}`);
        })
    }

    const getRoomsList = () => {
        const db = firebase.firestore();
        const collectionRef = db.collection('rooms');
  
        collectionRef.get().then((querySnapshot) => {
          const allrooms = [];
          querySnapshot.forEach((doc) => {
            var docdata = doc.data();
            allrooms.push({
              id: doc.id,
              users: docdata.users.length,
            });
          });
          setRoomList(allrooms);
          console.log(allrooms)
        }).catch((error) => {
          console.log('Помилка отримання документів:', error);
        });
    };
    

    return (
        <main>
            {roomListShow && (
                <div className={classes.overlay} onClick={()=>{setRoomListShow(!roomListShow)}}></div>
            )}
            <div className={classes.room_list_container}>
                {roomListShow ? (
                    <svg onClick={()=>{setRoomListShow(!roomListShow)}} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/></svg>
                ):(
                    <svg onClick={()=>{setRoomListShow(!roomListShow)}} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z"/></svg>

                )
                }
                <div className={classes.room_list} style={roomListShow ? {display: 'flex'} : {}}>
                    <p>Room list: </p>
                    {
                        roomList?.map(({ id, users })=>(
                            <div key={id} className={classes.room_li}>
                                <Link to={'/room/' + id}>{id}</Link>
                                <div className={classes.users_count}>
                                    {Array.from({ length: users }).map((_, index) => (
                                        <div key={index} className={classes.users_circles_count}></div>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
            <div className={classes.controls_container}>
                <div className={classes.controls}>
                    <form className={classes.create_room_form} onSubmit={(e)=>{e.preventDefault(); createRoom()}}>
                        <input value={createRoomUrl} onChange={(e) => {setCreateRoomUrl(e.target.value)}} type="text" placeholder='URL' required/>
                        <div className={classes.create_room_password}>
                            <label htmlFor="password_on">Password</label>
                            <input type="checkbox" id="password_on" onChange={(e)=>{setCrRoomPass(e.target.checked)}}/>
                        </div>
                        {crRoomPass && (
                            <input value={createRoomPass} onChange={(e) => {setCreateRoomPass(e.target.value)}} type="text" placeholder='Password'/>
                        )}
                        <button>Create Room</button>
                    </form>
                    <form className={classes.connect_room_form} onSubmit={(e)=>{e.preventDefault(); connectRoom()}}>
                            <input type="text" placeholder='Room ID' value={conRoomId} onChange={(e) => {setConRoomId(e.target.value)}}/>
                            <button>Connect to Room</button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Home;