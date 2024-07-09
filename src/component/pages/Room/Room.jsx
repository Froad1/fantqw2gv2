import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import classes from './Room.module.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/database'
import Player from '../../Player/Player';

const Room = () => {
    const { roomId } = useParams();
    const [user, setUser] = useState('');
    const [roomPass, setRoomPass] = useState('');
    const [enterPass, setEnterPass] = useState('');
    const [badPass, setBadPass] = useState(false);
    const [roomData, setRoomData] = useState(null);
    const [url, setUrl] = useState('');
    const [newUrl , setNewUrl] = useState('');
    const navigate = useNavigate();
    const playerRef = useRef(null); // Додано реф для збереження посилання на об'єкт плеєра
    const db = firebase.firestore();
    const roomRef = db.collection('rooms').doc(roomId);


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
            !user && navigate('/login');
            if(user){
                setUser(user)
                //Перевірка чи є користувач в кімнаті
                if(user.uid){
                    roomRef.get().then((doc)=>{
                        var data = doc.data();
                        data.users.includes(user.uid) ? getData() : checkPassword();
                    })
                }
            };
        });
    }, []);

    const checkPassword = () =>{
        const roomPassRef = db.collection('withPass').doc(roomId);
        roomPassRef.get().then((doc)=>{
            if(doc.exists){
                var data = doc.data();
                setRoomPass(data.password);
            }
            else{
                getData()
            }
        })
    }

    const unlockRoom = (e) =>{
        e.preventDefault();
        if(enterPass === roomPass){
            setRoomPass('');
            getData();
            roomRef.update({
                users: firebase.firestore.FieldValue.arrayUnion(user.uid)
              });
        }
        else{
            setBadPass(true);
        }
    }

    const getData = () =>{
        roomRef.get().then((doc)=>{
            var data = doc.data();
            setRoomData(data);
            setUrl(data.url);
        })
    }

    useEffect(() => {
        if (roomData) {
            initializePlayer(roomData.url);
        }
    }, [roomData]);


    const initializePlayer = (playerurl) =>{
        if (playerurl) {
            playerRef.current = new Playerjs({ id: 'player', file: playerurl });
            trackClientSnapshot();
            trackServerSnapshot();
        }
    }

    const trackClientSnapshot = () =>{
        var playerElement = document.getElementById('player');

        if (playerElement) {
            playerElement.addEventListener("play", () => {
                console.log('play');
                var time = playerRef.current.api('time');
                roomRef.update({
                    playing: true,
                    timing: time,

                })
            });
            playerElement.addEventListener("pause", () => {
                console.log('pause');
                var time = playerRef.current.api('time');
                roomRef.update({
                    playing: false,
                    timing: time,
                })
            });
        }
    }

    const trackServerSnapshot = () =>{
        roomRef.onSnapshot((doc) =>{
            var data = doc.data();
            data.playing ? window.pljssglobal[0].api('play') : window.pljssglobal[0].api('pause'); 
            playerRef.current.api('seek', data.timing);
            if(data.url != url){
                window.location.reload();
            }
        });
    }

    const changeUrl = (e) => {
        e.preventDefault()
      window.pljssglobal[0].api('file', newUrl);
      roomRef.update({
        url: newUrl,
      })
    };
    
    const exitRoom = () =>{
        roomRef.update({
            users: firebase.firestore.FieldValue.arrayRemove(user.uid)
        })
        navigate('/')
    }

    const deleteRoom = () =>{
        roomRef.delete();
        navigate('/')
    }

    return (
        <div className={classes.room}>

            {roomPass ? (
                    <div className={classes.password_container}>
                        <form onSubmit={(e) =>{unlockRoom(e)}}>
                            <label htmlFor='pass'>Enter Password:</label>
                            <input type='text' name='pass' value={enterPass} onChange={(e)=>{setEnterPass(e.target.value)}}/>
                            <button>Join</button>
                        </form>
                        {badPass && (<p>Password is incorect</p>)}
                    </div>

                ):(
                    <>
                        <div id="player"></div>
                        <p>Room ID: {roomId}</p>
                        <div className={classes.control_forms}>
                            <button onClick={exitRoom} className={classes.exit_button}>Exit Room</button>
                            <form onSubmit={changeUrl}>
                                <input type="text" placeholder='Url' value={newUrl} onChange={(e)=>{setNewUrl(e.target.value)}}/>
                                <button>Change Url</button>
                            </form>
                            <button onClick={deleteRoom} className={classes.delete_button}>Delete Room</button>
                        </div>
                    </>
                )
                
            }
        </div>
      );
};

export default Room;
