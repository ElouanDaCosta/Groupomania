import HomeBlock from '../components/homeBlock';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { getAll, deletePost } from '../api';


function Home() {
  const [posts, setPosts] = useState([]);
  const [sortedType, setSortedType] = useState('date')

  useEffect (() => {
    getAll()
      .then(response => {
        response.json().then (data => {
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

  const sortPosts = (sortedType) => {
    setSortedType(sortedType)
    getAll(sortedType)
      .then(response => {
        response.json().then (data => {
          setPosts(data);
        });
      })
  }

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