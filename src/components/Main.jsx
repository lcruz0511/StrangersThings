import React, { useState, useEffect } from "react";
import {
  Posts,
  Register,
  Navbar,
  Login,
  CreatePosts,
  PostDetails,
  MessageForm,
  UserProfile,
} from "./";

import { Route, Routes } from "react-router-dom";
import { getPosts } from "../api-adapter";

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState("");
  const [posts, setAllPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      const allPosts = await getPosts(localStorage.getItem("token"));
      setAllPosts(allPosts);
    }
    fetchPosts();
  }, []);
  function filterPosts(postId) {
    return posts.filter((post) => {
      return post._id == postId;
    });
  }
  return (
    <div id="main">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <Routes>
        <Route path="register" element={<Register isLoggedIn={isLoggedIn} />} />
        <Route
          path="login"
          element={
            <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route
          path="/users/me"
          element={<UserProfile posts={posts} setAllPosts={setAllPosts} />}
        />

        <Route path="posts" element={<Posts />} />
        <Route
          path="posts/:id/messages"
          element={<MessageForm filterPosts={filterPosts} />}
        />
        <Route
          path="posts/:id"
          element={
            <PostDetails filterPosts={filterPosts} isLoggedIn={isLoggedIn} />
          }
        />
        <Route path="post" element={<CreatePosts />} />
        <Route path="/" element={<Posts />} />
      </Routes>
    </div>
  );
};
export default Main;
