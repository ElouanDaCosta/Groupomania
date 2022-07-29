import '../styles/style.css';
import React, {useState, useEffect} from 'react';
import Header from '../components/header';
import Menu from '../components/menu';

function ProfileBlock ({imgProfile, username, handleSubmit}) {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {
    if (username) {
      setName(username);
    }
    if (imgProfile) {
      setImage(imgProfile);
    }
  }, [username ,imgProfile]);

  return (
    <section className='profile-page'>
      <Header />
        <div className='profile-page__content'>
          <div className='profile-page__content__top'>
            <form onSubmit={(e) => handleSubmit(e, {name, image})}>
              <img src={imgProfile} alt=''></img>
              <input
              name='image'
              id='file-input'
              type='file'
              multiple={false}
              className='profile-page__content__top__upload-image'
              onChange={(e) => 
                setImage(e.target.files[0]
              )}
              ></input>
              <input 
              className='profile-page__content__top__username-input' 
              type='text' name='username' 
              value={name}
              onChange={(e) => 
                setName(e.target.value
              )}>
              </input>
              <button className='profile-page__content__top__button'>Save</button>
            </form>
          </div>
          <div className='profile-page__content__bottom'>
          </div>
        </div>
      <Menu />
    </section>
  )
}

export default ProfileBlock;