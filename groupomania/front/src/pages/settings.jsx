import React, { useState } from 'react';
import SettingsBlock from '../components/settingsBlock';
import { logout } from '../api';
import { useNavigate } from 'react-router-dom'
import { deleteUser } from '../api';

function Settings () {
  const [isConfirmation, setIsConfirmation] = useState(false);
  const navigate = useNavigate();

  if (localStorage.getItem('token') === null) {
    window.location.href= '/login';
  }

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

  const confirmationMessage = () => {
    if (!isConfirmation) {
      document.querySelector('.confirmation__box').style.display = 'flex';
  } else {
    setIsConfirmation(false);
    document.querySelector('.confirmation__box').style.display = 'none';
  }
  }

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