import { Avatar, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useRef, useState } from "react";
import firebase from "firebase"
import getRecipientEmail from "../utils/getRecipientEmail";
import Timeago from "timeago-react"

function ChatScreen({ chat, messages}) {
    
    const endOfMessagesRef = useRef(null)
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [input, setInput] = useState("")
    const [messagesSnapshot] = useCollection(
        db.collection('chats')
        .doc(router.query.id)
        .collection("messages")
        .orderBy("timestamp", "asc"))

const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(chat.users, user))
)        
    
    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => (
                <Message key={message.id} 
                user={message.data().user} 
                message={{ 
                    ...message.data(),
                    timestamp: message.data().timestamp?.toDate().getTime(),
                }}
                />
            ));
        } else {
            return JSON.parse(messages).map(message => (
                <Message key={message.id} user={message.user} message={message} />
            ))
        }
    }

    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    }


    const sendMessage = (e) => {
        e.preventDefault();


        db.collection("users").doc(user.uid).set({
            lastseen: firebase.firestore.FieldValue.serverTimestamp()}
        , { merge: true });

        db.collection("chats").doc(router.query.id).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        });
        setInput("");
        scrollToBottom();
    }
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user)
    
    return (
        <Container>
            <Header> 
              { recipient ? (
                   <Avatar src={recipient?.photoURL} />
              ) : (
                  <Avatar>{recipientEmail[0]}</Avatar>
              )} 
               
               
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p> Last actives: {' '} 
                        {recipient?.lastseen?.toDate() ? (
                            <Timeago datetime={recipient?.lastseen?.toDate()} />         
                        ) : "Unavailable"}
                        </p>
                    ): (
                        <p>Loading Last active...</p>
                    )}
                </HeaderInformation>
                    <HeaderIcon>
                        <IconButton>
                            <AttachFileIcon />
                        </IconButton>
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    </HeaderIcon>
                
                
            </Header>        
            <MessageContainer>
                {showMessages()}
                <EndOfChat ref={endOfMessagesRef} />
            </MessageContainer>
            <InputContainer>
                <InsertEmoticonIcon/>
                <Input value={input} onChange={(e) => setInput(e.target.value)} />
                <button hidden type="submit" 
                disabled={!input} 
                onClick={sendMessage}>Send message</button>
                <MicIcon />
            </InputContainer>
        </Container>
    );
}

export default ChatScreen;

const Container = styled.div`
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
    padding: 11px;
`;

const HeaderInformation = styled.div`
    
    margin-left: 15px;
    flex: 1;
    
    

    > h3 {
        margin-bottom: 3px;

    }

    > p {
        font-size: 14px;
        color: gray;
    }

`;

const HeaderIcon = styled.div`
    
      `;


const EndOfChat = styled.div`
    margin-bottom: 50px;
`;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;

`;


const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom:0;
    background-color: white;
    z-index: 100;
`;


const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;

`;