import '../styles/style.css';
import React from 'react';
import Post from './post';
import Menu from './menu';
import NewPostButton from './newPostButton';

function HomeBlock ({posts, sortPosts, sortedType, modify, deletePost, confirmationMessage}) {
  return (
    <section className='home-page'>
      <div className="home-page__scrolling-menu">
        <select value={sortedType} onChange={(e) => sortPosts(e.target.value)}>
          <option value={'date'}>Dernier post</option>
          <option value={'popularity'}>Les plus populaires</option>
        </select>
      </div>
      <div className='home-page__content-menu'>
        <div className="home-page__content">
          {/*
          Use the map function to get all the value of the post and send them in props to the Post components  
          */}
          {posts.map(post => <Post
              key={post.id}
              id={post.id}
              authorId={post.userId}
              author={post.user.name}
              authorImage={post.user.image}
              text={post.text}
              image={post.image}
              modify={modify}
              liked={post.liked}
              deletePost={deletePost}
              modifiable={post.modifiable}
              nbLikes={post.nbLikes}
          />)}
        </div>
        <NewPostButton />
        <Menu />
      </div>
    </section>
  )
};

export default HomeBlock;