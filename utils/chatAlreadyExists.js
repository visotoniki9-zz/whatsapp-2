const chatAlreadyExists = (recipientEmail, chatsSnapshot) => !!chatsSnapshot?.docs.find(
  (chat) => chat.data().users.find((usr) => usr === recipientEmail)?.length > 0,
);

export default chatAlreadyExists;
