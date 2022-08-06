import React, { useState } from 'react';
import SettingsBlock from '../components/settingsBlock';
import { logout } from '../api';
import { useNavigate } from 'react-router-dom'
import { deleteUser } from '../api';

function Settings () {
  //state to show the confirmation message or not
  const [isConfirmation, setIsConfirmation] = useState(false);
  const navigate = useNavigate();

  //if there is no token item in the localStorage, redirect to the login page
  if (localStorage.getItem('token') === null) {
    window.location.href= '/login';
  }

  //function to clear the localStorage when logout
  const handleSubmit = event => {
    logout()
    .then(response => {
      if (response.status === 200) {
        navigate('/login');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } else {
        console.log('error');
      }
    })
  }

  //function to change the style of the confirmation message to show it
  const confirmationMessage = () => {
    if (!isConfirmation) {
      document.querySelector('.confirmation__box').style.display = 'flex';
  } else {
    setIsConfirmation(false);
    document.querySelector('.confirmation__box').style.display = 'none';
  }
  }

  //function to clear the localStorage when you delete the user
  const deleteUserAction = () => {
    deleteUser()
    .then(response => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    })
    .catch(error => {
      console.log(error);
    })
  }

  return (
    <React.StrictMode>
      <SettingsBlock
      handleSubmit={handleSubmit}
      deleteUserAction={deleteUserAction}
      confirmationMessage={confirmationMessage}
      />
    </React.StrictMode>
  )
}

export default Settings;