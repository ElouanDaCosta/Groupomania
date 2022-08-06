import React, {useState} from 'react';
import ProfileBlock from '../components/profileBlock';
import { getUser, updateUser } from '../api';

function SinglePost() {
  const userId = localStorage.getItem('user');
  //state to save the image of the user
  const [imgProfile, setImgProfile] = useState();
  //state to save the username of the user
  const [username, setUsername] = useState();

  if (localStorage.getItem('token') === null) {
    window.location.href= '/login';
  }

  /*
  function to send a fetch request and get the username and the profile picture of the user
  and save them in two state
  */
  getUser(userId)
    .then(response => {
      response.json().then(data => {
        setUsername(data.name);
        setImgProfile(data.image);
      });
    })
    .catch(error => {
      console.log(error);
    })

  const handleSubmit = (e, user) => {
    e.preventDefault();
    updateUser(user)
      .then(response => {
        response.json().then(data => {
          console.log(data);
        });
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <React.StrictMode>
      <ProfileBlock
      handleSubmit={handleSubmit}
      imgProfile={imgProfile}
      username={username}
      />
    </React.StrictMode>
  );
}

export default SinglePost;