import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import { updatePosts, deletePost } from "../api-adapter";
import MessageForm from "./MessageForm";
import "./PostDetails.css";

const PostDetails = (props,) => {
  const { id } = useParams();
  const post = props.filterPosts(id)[0];

  const [formDetails, setFormDetails] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    willDeliver: false,
  });
  useEffect(() => {
    async function makeDetails() {
      setFormDetails({
        title: post.title,
        description: post.description,
        price: post.price,
        location: post.location,
      });
    }
    makeDetails();
  }, []);
  function handleChange(event) {
    event.preventDefault();
    const toUpdate = event.target.id;
    const update = event.target.value;
    const updatedForm = { ...formDetails, [toUpdate]: update };
    setFormDetails(updatedForm);
  }

  async function handleDelete(event) {
    event.preventDefault();
    const toDelete = event.target.id;
    const token = localStorage.getItem("token");
    const deleted = await deletePost(toDelete, token);
  }
  async function handleSubmit(event) {
    event.preventDefault();

    const updatedPost = await updatePosts(
      formDetails,
      post._id,
      localStorage.getItem("token")
    );
  }

  return (
    <>
      {post ? (
        <>
          <div className="box">
            <div>
              <b>{post.title}</b>
            </div>
            <div>{post.description}</div>
            <div>
              <b>Price: </b>
              {post.price}
            </div>
            <div>
              <b>Location: </b>
              {post.location}
            </div>
            <div>
              {post.willDeliver ? <b>Will Deliver</b> : <b>Will Not Deliver</b>}
            </div>

            <NavLink to={"/posts"}>
              <button>Go Back</button>
            </NavLink>
            {!post.isAuthor ? <MessageForm /> : null}
           
            <div>
              {" "}
              {post.isAuthor ? (
                <form onChange={handleChange} onSubmit={handleSubmit}>
                  <h4 className="editTitle">Edit Post Below</h4>
                  <div className="EditForm">
                    <label>Title: </label>
                    <input id="title" defaultValue={formDetails.title} />
                    <label>Description: </label>
                    <input
                      id="description"
                      defaultValue={formDetails.description}
                    />
                    <label>Price: </label>
                    <input id="price" defaultValue={formDetails.price} />
                    <label>Location</label>
                    <input id="location" defaultValue={formDetails.location} />
                    <button type="submit">Submit</button>
                  </div>
                </form>
              ) : null}
              {post.isAuthor ? (
                <button
                  className="deleteButton"
                  id={post._id ? `${post._id}` : null}
                  onClick={(event) => {
                    handleDelete(event);
                  }}
                >
                  Delete Post
                </button>
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <div>Loading post details...</div>
      )}
    </>
  );
};

export default PostDetails;
