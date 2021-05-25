/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import moment from 'moment';
import { auth } from '../firebase';

function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);

  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever;

  return (
    <Container>
      <TypeOfMessage>
        {message.message}
        <Timestamp>
          {message.timestamp ? moment(message.time).format('LT') : '...'}
        </Timestamp>
      </TypeOfMessage>
    </Container>
  );
}

export default Message;

const Container = styled.div`
`;

const TypeOfMessage = styled.p`
width: fit-content;
padding:15px;
border-radius:8px;
margin:10px;
min-width:60px;
padding-bottom:26px;
position:relative;
text-align:right;
display:flex;
`;

const Sender = styled(TypeOfMessage)`
margin-left:auto;
background-color: #dcf8c6
`;

const Reciever = styled(TypeOfMessage)`
text-align: left;
background-color: whitesmoke;
`;

const Timestamp = styled.span`
color:gray;
padding:10px;
font-size: 9px;
position:absolute;
bottom:0;
text-align:right;
right:0;
`;
