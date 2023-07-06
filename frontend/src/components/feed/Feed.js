import React, { useEffect, useState } from "react";
import Post from "../post/Post";
import Comment from "../comment/Comment";
import PostForm from "../post/PostForm";
import CommentForm from "../comment/CommentForm";

const Feed = ({ navigate }) => {
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [comments, setComments] = useState([]);
  console.log(comments);

  useEffect(() => {
    const fetchPosts = async () => {
      if (token) {
        const response = await fetch("/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        window.localStorage.setItem("token", data.token);
        setToken(window.localStorage.getItem("token"));
        setPosts(data.posts);
      } else {
        navigate("/");
      }
    };

    fetchPosts();
  }, [token, navigate]);

  useEffect(() => {
    const fetchComments = async () => {
      if (token) {
        const response = await fetch("/comments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        window.localStorage.setItem("token", data.token);
        setToken(window.localStorage.getItem("token"));
        setComments(data.comments);
      } else {
        navigate("/");
      }
    };

    fetchComments();
  }, [token, navigate]);

  const handleNewPost = (post) => {
    setPosts((prevPosts) => {
      const newPosts = [...prevPosts, post];
      const reversedPosts = newPosts.reverse();
      return reversedPosts;
    });
  };
  const handleNewComment = (comment) => {
    // console.log(`This is in handleNewComment ${comment}`);
    setComments((prevComments) => {
      const newComments = [...prevComments, comment];
      const reversedComments = newComments.reverse();
      return reversedComments;
    });
  };

  if (token) {
    return (
      <>
        <PostForm token={token} onNewPost={handleNewPost} />
        <div>
          <h2>Posts</h2>
          <div id="feed" role="feed">
            {posts.map((post) => (
              <div key={post._id} className="post-container">
                <Post post={post} />
                <CommentForm
                  token={token}
                  onNewComment={handleNewComment}
                  postId={post._id}
                />
                <div id="comment-feed">
                  {comments
                    .filter((comment) => comment.postId === post._id)
                    .map((comment) => (
                      <Comment comment={comment} key={comment._id} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
};

export default Feed;
