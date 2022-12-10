import React, { useState } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { Link } from "react-router-dom";

const Post = ({ post, callback }) => {
  const user_id = window.localStorage.getItem("user_id");
  const token = window.localStorage.getItem("token");

  const [details, setDetails] = useState(false);
  const isPostLikedByUser = post.likes.includes(user_id);
  const [isLiked, toggleIsLiked] = useState(isPostLikedByUser);
  const [comments, setComment] = useState("");

  const handleLikeToggle = async () => {
    toggleIsLiked((prevState) => !prevState);

    if (user_id) {
      let response = await fetch(`/posts/${post._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: "likes", isLiked, user_id }),
      });
      const data = await response.json();
      if (response.status !== 202) {
        console.log(data.error);
      } else {
        callback(true);
      }
    }
  };

  const handleCommentSubmit = async (event) => { 
    event.preventDefault();
    if (user_id && comments !== "") {

      const {format} = require('date-fns')
      let date = format(new Date(), 'dd.MM.yy');
      let time = format(new Date(), 'HH:mm');

      let response = await fetch(`/posts/${post._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: "comments", comments: comments + " at " + time + " on " + date })
        });
      const data = await response.json();
      if (response.status !== 202) {
        console.log(data.error);
      } else {
        callback(true);
      }
    }
    setComment("");
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value)
  }

  const messageFilter = (message) => {
    const button = (          
      <>         
        <button
          className="btn-message"
          onClick={() => setDetails((prev) => !prev)}
        >
          {details ? "Show less" : "Show more"}
        </button>
      </>
    );
    if (post.message.split(' ').length >= 30) {
      let formatted = message.split(' ').slice(0, 30).join(' ');
      return (
        <>
        {details ? message + ' ' : formatted + '... '}
        {button}
        </>
      );
    } else {
      return message;
    }
  }

  return (
    <div className="post">
      <div className="post-header">
        <img
          className='user-icon'
          alt='user-icon'
          src= {post.user_id.profile_pic}
        />

        <div className="post-header-info">
          <Link className="link-profile" to={"/users/" + post.user_id._id}>
            {post.user_id.full_name}
          </Link>
          <label>
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </label>
        </div>
      </div>
      <div className="post-body">
        <article className="post-message" data-cy="post" key={post._id}>
          {messageFilter(post.message)}
        </article>
      </div>
      <div className="post-footer">
        <button className="btn-details" onClick={handleLikeToggle}>
          {isLiked ? (
            <img
              className="img_likes"
              src="../heart_full.svg"
              alt="full heart"
            />
          ) : (
            <img
              className="img_likes"
              src="../heart_empty.svg"
              alt="empty heart"
            />
          )}
        </button>
        <span>{post.likes.length}</span>
      </div>

      <form className='post-body' onSubmit={handleCommentSubmit}>
        <input
          placeholder="Post a comment!"
          id="comments"
          type="text"
          value={comments}
          onChange={handleCommentChange}
        />
        <input id="submit" type="submit" value="Comment" />
      </form>
      
      <div className='post-body'>
        <article>
          {post.comments.map((item) => <div>{item}</div>)}
        </article>
      </div>
    </div>
  );
};

export default Post;
