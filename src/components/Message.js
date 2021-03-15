import React, { forwardRef } from "react";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import "./Message.css";
import { InputLabel } from "@material-ui/core";
//import icon from "../messenger-clone-icon.png";
//import db from "./firebase";
import firebase from "firebase";

const Message = forwardRef(({ id_, username, message }, ref) => {
  const isUser = username === message.username;
  function deleteMSG(e) {
    let id =
      e.target.id ||
      e.target.parentElement.parentElement.id ||
      e.target.parentElement.id ||
      e.target.parentElement.parentElement.parentElement.id;

    if (
      username === "admin" &&
      window.confirm("Are u sure u  want to delete this message?")
    ) {
      firebase.firestore().collection("msg").doc(id).delete();
    }
  }
  return (
    <div
      onClick={deleteMSG}
      id={id_}
      ref={ref}
      className={`message ${isUser && "__user"}`}
    >
      <InputLabel>{!isUser && `${message.username}:`}</InputLabel>
      <Card className={`${isUser ? "__userCard" : "not__userCard"}`}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {message.text}
          </Typography>
        </CardContent>
      </Card>
      {/*<p>{message.timestamp_}</p>*/}
    </div>
  );
});

export default Message;
