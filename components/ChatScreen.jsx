/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { useCollection } from 'react-firebase-hooks/firestore';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useRef, useState } from 'react';
import SendIcon from '@material-ui/icons/Send';
import firebase from 'firebase';
import TimeAgo from 'timeago-react';
import { auth, db } from '../firebase';
import Message from './Message';
import getRecipientEmail from '../utils/getRecipientEmail';

function ChatScreen({ chat, messages }) {
  console.log(chat, messages);
  const [user] = useAuthState(auth);
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef(null);
  const router = useRouter(auth);
  const [messagesSnapshot] = useCollection(
    db
      .collection('chats')
      .doc(router.query.id)
      .collection('messages')
      .orderBy('timestamp', 'asc'),
  );

  const [recipientSnapshot] = useCollection(
    db.collection('users').where('email', '==', getRecipientEmail(chat.users, user)),
  );

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    }
    return JSON.parse(messages).map((message) => (
      <Message key={message.id} user={message.user} message={message} />
    ));
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    // Update last seen
    db.collection('users').doc(user.uid).set(
      { lastSeen: firebase.firestore.FieldValue.serverTimestamp() },
      { merge: true },
    );

    db.collection('chats').doc(router.query.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput('');
    scrollToBottom();
  };

  const recipientEmail = getRecipientEmail(chat.users, user);
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}

        <HeaderInformation>

          <h3>{recipientEmail}</h3>

          {recipientSnapshot ? (
            <p>
              Last active:
              {' '}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                'Unavailable'
              )}
            </p>
          ) : (
            <p>Loading last active...</p>
          )}
        </HeaderInformation>

        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>

      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <IconButton disabled={!input} type="submit" onClick={sendMessage}>
          <SendIcon />
        </IconButton>
        <IconButton>
          <MicIcon />
        </IconButton>
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div`
    `;

const Input = styled.input`
flex:1;
outline:0;
border:none;
border-radius:10px;
background-color:whitesmoke;
padding:20px;
margin-left:15px;
margin-right:15px;
`;

const InputContainer = styled.form`
display:flex;
align-items:center;
padding:10px;
position:sticky;
bottom:0;
background-color:white;
z-index:100;
`;

const Header = styled.div`
        position: sticky;
        background-color: white;
        z-index: 100;
        top: 0;
        display: flex;
        padding: 11px;
        height: 80px;
        align-items: center;
        border-bottom: 1px solid whitesmoke;
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

const EndOfMessage = styled.div`
        margin-bottom: 50px;
    `;

const HeaderIcons = styled.div`
    `;

const MessageContainer = styled.div`
        padding: 30px;
        background-color: #e5ded8;
        min-height: 90vh;
    `;
