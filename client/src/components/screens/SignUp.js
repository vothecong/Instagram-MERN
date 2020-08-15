import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
import { useHistory, Link } from "react-router-dom";
import M from "materialize-css";

function SignUp(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);

  const history = useHistory();

  useEffect(() => {
    if (url) {
      uploadField();
    }
  }, [url]);

  const uploadField = () => {
    const validateEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!validateEmail.test(email)) {
      M.toast({ html: "Email ko hop le!!!", classes: "#e53935 red darken-1" });
      return;
    }
    fetch("http://localhost:4000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        photo: url,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("RESULT BY SIGNUP NO AVATAR", result);
        if (result.error) {
          M.toast({ html: result.error, classes: "#e53935 red darken-1" });
        } else {
          M.toast({ html: result.message, classes: "#8bc34a light-green" });
          history.push("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadAvatar = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "instagram-clone");
    data.append("cloud_name", "không có");
    fetch("	https://api.cloudinary.com/v1_1/kh-ng-c/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUrl(result.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect(() => {
  //   if (url) {
  //     uploadField();
  //   }
  //   return () => {};
  // }, [url]);

  const submit = () => {
    if (image) {
      uploadAvatar();
    } else {
      uploadField();
    }
  };

  return (
    <div className="form-login">
      <h3>Instagram</h3>
      <div className="input-field">
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="validate"
        />
        <label htmlFor="name">Name</label>
      </div>
      <div className="input-field">
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="validate"
        />
        <label htmlFor="email">Email</label>
      </div>
      <div className="input-field">
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="validate"
        />
        <label htmlFor="password">Password</label>
      </div>
      <div className="file-field input-field">
        <div className="btn">
          <span>UPLOAD AVATAR</span>
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
        onClick={() => submit()}
      >
        Register
      </button>
      <h5>
        <Link to="/signin">Already have an account ?</Link>
      </h5>
    </div>
  );
}

SignUp.propTypes = {};

export default SignUp;
