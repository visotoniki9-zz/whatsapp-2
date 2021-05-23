import styled from 'styled-components';
import Head from 'next/head';
import { Circle } from 'better-react-spinkit';

function Loading() {
  return (
    <Container>

      <Head>
        <title>Loading</title>
      </Head>

      <LoadingContainer>
        <Logo src="/logo.svg" />
        <Circle color="#3cbc28" size={50} />
      </LoadingContainer>

    </Container>
  );
}

export default Loading;

const Container = styled.div`
background: whitesmoke;
display:grid;
place-items:center;
height: 100vh;
`;

const LoadingContainer = styled.div`
padding:100px;
display:flex;
flex-direction:column;
align-items:center;

`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;
