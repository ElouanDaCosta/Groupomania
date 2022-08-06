import React, {useState} from "react";
import NewPostBlock from "../components/newPostBlock";
import { create, modifyPost, getOne } from "../api";
import { useNavigate } from 'react-router-dom'


function NewPost() {
  //state to save the file in the input to preview it
  const [img, setImg] = useState();
  //state to save the file in the input and send it to the API
  const [imgForm, setImgForm] = useState();
  //state to save the text in the textarea and send it to the API
  const [textForm, setTextForm] = useState();
  const navigate = useNavigate();
  //function to create a temporary url and send it to the src in the img tag
  const onImageChange = (e) => {
    const [file] = e.target.files;
    setImg(URL.createObjectURL(file));
  };

  //if there is no token item in the localStorage, redirect to the login page
  if (localStorage.getItem('token') === null) {
    window.location.href= '/login';
  }

  const deleteImage = () => {
    setImg(null);
    setImgForm(null);
  }

  //get the value of the id params in the url
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  //if there is an id params in the url, show the value of the post in the 
  if (id) {
    getOne(id)
      .then(response => {
        response.json().then(data => {
          setImgForm(data.image);
          setTextForm(data.text);
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  /*
  function to modify the post if there is an id in the url, 
  and create a post if there is no id
  */

  const HandleSubmit = (e, post) => {
    e.preventDefault();
    if (id) {
      modifyPost(id, post)
        .then(response => {
          response.json().then(data => {
            navigate('/');
          });
        })
        .catch(error => {
          console.log(error);
        })
    } else {
      create(post)
        .then(response => {
          response.json().then (data => {
            navigate('/');
          })
        })
        .catch(error => {
          console.log(error);
        })
    }
  }

  return (
    <React.StrictMode>
      <NewPostBlock
      onImageChange={onImageChange}
      deleteImage={deleteImage}
      img={img}
      imgForm={imgForm}
      textForm={textForm}
      HandleSubmit={(e, post) => HandleSubmit(e, post)}
      />
    </React.StrictMode>
  );
}

export default NewPost;