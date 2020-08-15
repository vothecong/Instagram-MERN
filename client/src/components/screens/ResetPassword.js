import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import M from "materialize-css";

function ResetPassword(props) {
  const [email, setEmail] = useState("");
  const history = useHistory();

  const submit = () => {
    const validateEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!validateEmail.test(email)) {
      M.toast({ html: "Email ko hop le!!!", classes: "#e53935 red darken-1" });
      return;
    }
    fetch("http://localhost:4000/users/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
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

  return (
    <div className="form-login">
      <h3>Instagram</h3>
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
      <button
        className="btn waves-effect waves-light"
        type="submit"
        name="action"
        onClick={() => submit()}
      >
        Send Mail
      </button>
    </div>
  );
}

export default ResetPassword;
