/* eslint-disable import/no-extraneous-dependencies */
import { Avatar } from '@material-ui/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { auth, db } from '../firebase';
import getRecipientEmail from '../utils/getRecipientEmail';

function Chat({ id, users }) {
  // Page router to open chats
  const router = useRouter();
  // Current User
  const [user] = useAuthState(auth);
  // All recipient emails except current user
  const [recipientSnapshot] = useCollection(
    db.collection('users')
      .where('email', '==', getRecipientEmail(users, user)),
  );

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };
  // Holds all recipient data
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  // Helper to filter out current user email from current chat emails
  const recipientEmail = getRecipientEmail(users, user);

  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <UserAvatar src={recipient?.photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      ) }
      <p>{recipientEmail}</p>
    </Container>
  );
}

export default Chat;

const Container = styled.div`

display: flex;
align-items: center;
cursor: pointer;
padding:15px;
word-break:break-word;

:hover{
  background-color:#e0eaeb
}
`;

const UserAvatar = styled(Avatar)`
margin: 5px;
margin-right:15px;
`;
