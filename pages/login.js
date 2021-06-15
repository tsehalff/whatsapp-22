import { Button } from "@material-ui/core";
import Head from "next/head";
import styled from "styled-components"
import { auth, provider } from "../firebase";

function Login() {

    const signIn = () => {
        auth.signInWithPopup(provider).catch(alert);
        
    };
 
    return (
        <div>
            <Container>
                <Head>
                    <title>Login</title>
                </Head>

                <LoginContainer>
                    <Logo 
                        src="data:image/png;base64,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"
                    />
                    <Button onClick={signIn} variant="outlined">Sign In with Google</Button>
                </LoginContainer>
            </Container>
        </div>
    )
}

export default Login


const Container = styled.div`
    display:grid;
    place-items: center;
    height: 100vh;

    


`;

const LoginContainer = styled.div`
    padding: 100px;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.75);
`;

const Logo = styled.img`
    height:200px;
    width: 200px;
    margin-bottom: 50px;
`;