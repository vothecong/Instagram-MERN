import React, { useState, useEffect } from "react";
// import PropTypes from 'prop-types'
import M from "materialize-css";
import { useHistory } from "react-router-dom";

function CreatePost(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const history = useHistory();
  useEffect(() => {
    if (url) {
      fetch("http://localhost:4000/contents/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          description,
          url,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log("RESULT BY CREATE POST",result);
          if (result.error) {
            M.toast({ html: result.error, classes: "#e53935 red darken-1" });
          } else {
            M.toast({ html: result.message, classes: "#8bc34a light-green" });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return () => {};
  }, [url]);

  const PostData = () => {
    let data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "instagram-clone");
    data.append("cloud_name", "không có");
    fetch("	https://api.cloudinary.com/v1_1/kh-ng-c/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log("RESULT CREATE POST", result.url);
        setUrl(result.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="form-login">
      <h3>Post</h3>
      <div className="input-field">
        <input
          id="title"
          type="text"
          className="validate"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="title">Title</label>
      </div>
      <div className="input-field">
        <input
          id="description"
          type="text"
          className="validate"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label htmlFor="description">description</label>
      </div>
      <div className="file-field input-field">
        <div className="btn">
          <span>Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light"
        type="submit"
        name="action"
        onClick={() => PostData()}
      >
        Register
      </button>
    </div>
  );
}

export default CreatePost;
