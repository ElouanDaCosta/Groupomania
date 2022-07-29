import React, {useState} from "react";
import NewPostBlock from "../components/newPostBlock";
import { create, modifyPost, getOne } from "../api";
import { useNavigate } from 'react-router-dom'


function NewPost() {
  const [img, setImg] = useState();
  const [imgForm, setImgForm] = useState();
  const [textForm, setTextForm] = useState();
  const navigate = useNavigate();
  const onImageChange = (e) => {
    const [file] = e.target.files;
    setImg(URL.createObjectURL(file));
    setImg(file)
  };

  const deleteImage = () => {
    setImg(null);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (id) {
    getOne(id)
      .then(response => {
        response.json().then(data => {
          setImgForm(data.post.image);
          setTextForm(data.post.text);
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  const HandleSubmit = (e, post) => {
    e.preventDefault();
    if (id) {
      modifyPost(id, post)
        .then(response => {
          response.json().then(data => {
            console.log(data);
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
            console.log(data);
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