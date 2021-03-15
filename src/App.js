import React, { useState, useEffect } from "react";
import "./App.css";
import { Button, FormControl, Input, InputLabel } from "@material-ui/core";
import Message from "./components/Message";
import db from "./components/firebase";
import firebase from "firebase";
import FlipMove from "react-flip-move";
import icon from "./messenger-clone-icon.png";
import SendIcon from "@material-ui/icons/Send";
import { IconButton } from "@material-ui/core";
import { Notifications } from "react-push-notification";
import addNotification from "react-push-notification";

let showMsgs = "";

const options = {
  title: "NEW MESSAGE",
  message: "U received a message",
  duration: 3000,
  theme: "darkblue",
  native: true,
  icon: icon,
  //vibrate: [100, 200, 300],
};
function App() {
  const [input, setInput] = useState("");
  const [msg, setMSG] = useState([]);
  const [userName, setUserName] = useState("");
  const [retryMsg, setretryMsg] = useState("");

  function verify_() {
    let enteredName = prompt("Please enter your name:").toLowerCase();
    db.collection("user")
      .doc(enteredName)
      .get()
      .then((doc) => {
        console.log(doc.exists);
        if (doc.exists) {
          let enteredPwd = prompt("Please enter your password:");
          if (doc.data().pwd === enteredPwd) {
            showMsgs = true;
            setUserName(enteredName);
          } else {
            setretryMsg("Password incorect retry");
            showMsgs = false;
          }
        } else {
          setretryMsg("Username incorect retry");
          showMsgs = false;
        }
      });
  }

  useEffect(() => {
    verify_();
  }, []);

  useEffect(() => {
    db.collection("msg")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setMSG(
          snapshot.docs.map((doc) => ({ id: doc.id, message: doc.data() }))
        );
        addNotification(options);
      });
  }, []);

  function sendMSG(e) {
    e.preventDefault();
    db.collection("msg").add({
      text: input,
      username: userName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput("");
  }

  return (
    <div className="App">
      <div className={`${showMsgs ? "show" : "unshow"}`}>
        <img src={icon} width="100px" height="100px" alt="icon" />
        <form className="__form">
          <FormControl className="__formControl">
            <InputLabel>enter message...</InputLabel>
            <Input
              className="__input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <IconButton
              className=".__iconButton"
              disabled={!input || !showMsgs}
              variant="contained"
              color="primary"
              type="submit"
              onClick={sendMSG}
            >
              <SendIcon />
            </IconButton>
            {/*<Button
              disabled={!input || !showMsgs}
              variant="contained"
              color="primary"
              type="submit"
              onClick={sendMSG}>
              send message
            </Button>*/}
          </FormControl>
        </form>

        <FlipMove>
          {msg.map(({ id, message }) => (
            <Message key={id} username={userName} message={message} id_={id} />
          ))}
        </FlipMove>
      </div>
      <div className={`${!showMsgs ? "show" : "unshow"}`}>
        <InputLabel>{retryMsg}</InputLabel>
        <Button
          variant="contained"
          color="primary"
          onClick={verify_}
          disabled={showMsgs !== false}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}

export default App;
