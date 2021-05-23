/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
/* eslint-disable no-alert */
import { Avatar, IconButton, Button } from '@material-ui/core';
import styled from 'styled-components';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import Chat from './Chat';

function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = db.collection('chats')
    .where('users', 'array-contains', user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const input = prompt('Please enter an email address for the user you wish to chat with');

    if (!input) return null;

    if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
      db.collection('chats').add({
        users: [user.email, input],
      });
    }
  };

  const chatAlreadyExists = (recipientEmail) => !!chatsSnapshot?.docs.find(
    (chat) => chat.data().users.find((usr) => usr === recipientEmail)?.length > 0,
  );

  return (
    <Container>
      <Header>
        <UserAvatar
          onClick={() => auth.signOut()}
          s
        />
        <IconsContainer>

          <IconButton>
            <ChatIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>

        </IconsContainer>
      </Header>
      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search" />
      </Search>

      <SidebarButton onClick={createChat}>Start a new Chat</SidebarButton>

      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} user={chat.data().users} />
      ))}

    </Container>
  );
}

export default Sidebar;

const Container = styled.div``;

const Search = styled.div`
display: flex;
align-items:center;
padding:20px;
border-radius:2px;
`;

const SidebarButton = styled(Button)`
width: 100%;
&&&{
border-top:1px solid whitesmoke;
border-bottom:1px solid whitesmoke
}
`;

const SearchInput = styled.input`
outline-width:0;
outline:none;
border:none;
flex:1;
color:gray;
`;

const Header = styled.div`
display: flex;
position:sticky;
top: 0;
background-color:white;
z-index: 1;
justify-content: space-between;
align-items: center;
padding:15px;
height:80px;
border-bottom: 1px solid whitesmoke;
`;

const IconsContainer = styled.div``;

const UserAvatar = styled(Avatar)`
cursor:pointer;
margin:10px;
:hover{
opacity: 0.8;
}
`;
