import HomeBlock from '../components/homeBlock';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { getAll, deletePost } from '../api';


function Home() {
  //state to save the posts from the getAll and display them
  const [posts, setPosts] = useState([]);
  //state to sort the posts depending on the sortedType in the getAll
  const [sortedType, setSortedType] = useState('date')

  useEffect (() => {
    getAll()
      .then(response => {
        response.json().then (data => {
          //if you are not log, redirect to the login page
          if (response.status === 401) {
            window.location.href= '/login';
          }
          setPosts(data);
          return data;
        });
      })
  }, [])

    const modify = (id) => {
      
    }

  //use the sortedType state, get the sortedType in the getAll and sort the posts
  const sortPosts = (sortedType) => {
    setSortedType(sortedType)
    getAll(sortedType)
      .then(response => {
        response.json().then (data => {
          setPosts(data);
        });
      })
  }

  //when deleting a post, call the getAll to refresh the posts
  const deletePostAction = (id) => {
    deletePost(id)
    .then(() => {
      return getAll()
    })
    .then(response => {
      response.json().then (data => {
        setPosts(data);
        return data;
      });
    })
  }

  return (
    <React.StrictMode>
      <HomeBlock
        modify={modify}
        posts={posts}
        sortedType={sortedType}
        sortPosts={sortPosts}
        deletePost={deletePostAction}
      />
    </React.StrictMode>
  );
}

export default Home