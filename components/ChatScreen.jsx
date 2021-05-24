/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import Message from './Message';

function ChatScreen() {
  const [user] = useAuthState(auth);
  const router = useRouter(auth);
  const [messagesSnapshot] = useCollection(
    db
      .collection('chats')
      .doc(router.query.id)
      .collection('messages')
      .orderBy('timestamp', 'asc'),
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
  };

  return (
    <Container>
      <Header>
        <Avatar />

        <HeaderInformation>
          <h3>Rec Email</h3>
          <p>Last seen ...</p>
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
        <EndOfMessage />
      </MessageContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div`
    `;

const Header = styled.div`
        position: sticky;
        background-color: white;
        z-index: 100;
        top: 0;
        display: flex;
        padding: 11px;
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
