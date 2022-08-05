import '../styles/style.css';
import React, {useState, useEffect} from 'react';
import Menu from './menu';
import Header from './header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage  } from '@fortawesome/free-solid-svg-icons'


function NewPostBlock ({onImageChange, img, imgForm, textForm, deleteImage, HandleSubmit}) {  
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (textForm) {
      setText(textForm);
    }
    if (imgForm) {
      setImage(imgForm);
    }
  }, [textForm, imgForm]);

  const uploadImage = (e) => {
    setImage(e.target.files[0]);
    onImageChange(e);
  }

  return (
    <section className='newpost-page'>
      <Header />
      <div className='newpost-page__content'>
        <form onSubmit={(e) => HandleSubmit(e, {text, image})} className='newpost-page__content__form'>
          <textarea
          onChange={(e) => setText(e.target.value)}
          name='text' 
          id='add-text' 
          className='newpost-page__content__form__add-text' 
          type='text' 
          value={text}
          />
          <label for='add-text'></label>
          <input
          name='image'
          id='file-input'
          type='file'
          multiple={false}
          onChange={(e) => {
            uploadImage(e)
          }}
          className='newpost-page__content__form__upload-image'
          ></input>
          <label for="file-input" className='newpost-page__content__form__upload-image__label'><FontAwesomeIcon className='newpost-page__content__form__upload-image__label__icon' icon={faImage} /></label>
          {img && (
            <div className='newpost-page__content__form__image-container'>
              <img className='newpost-page__content__form__upload-image__img' src={img} alt='' />
              <button className='newpost-page__content__form__upload-image__delete' onClick={deleteImage}>Supprimer</button>
            </div>
          )}
          <button  className='newpost-page__content__form__button' type='submit'>Publier</button>
        </form>
      </div>
      <Menu />
    </section>
  )
}

export default NewPostBlock;