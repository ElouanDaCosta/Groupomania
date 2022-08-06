import LoginBlock from '../components/loginBlock';
import React from 'react';
import {login} from '../api';


async function LoginFetch () {
  await login()
    .then((response) => { 
      //if the response status is 200, create two item in the localStorage to save the token and the userId
      if (response.status === 200) {
        response.json().then (token => {
          const userId = token.userId;
          const Token = (token.token);
          localStorage.setItem('user', userId);
          localStorage.setItem('token', Token);
          window.location.href= '/';
        });
      }
    })
    .catch((error) => { console.log(error)})
}

function Login() {
  const handleSubmit = event => {
    event.preventDefault();
    LoginFetch()
  }
  return (
    <React.StrictMode>
      <LoginBlock
        handleSubmit={handleSubmit}
      />
    </React.StrictMode>
  );
}

export default Login