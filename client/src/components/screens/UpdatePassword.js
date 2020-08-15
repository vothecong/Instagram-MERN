import React, { useState, useEffect } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import M from "materialize-css";

function UpdatePassword(props) {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const history = useHistory();

  const submit = () => {
    fetch("http://localhost:4000/users/updatepassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
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
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="validate"
        />
        <label htmlFor="password">Password</label>
      </div>
      <button
        className="btn waves-effect waves-light"
        type="submit"
        name="action"
        onClick={() => submit()}
      >
        Update password
      </button>
    </div>
  );
}

export default UpdatePassword;
