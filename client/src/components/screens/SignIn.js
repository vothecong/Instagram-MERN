import React, { useState, useContext } from "react";
// import PropTypes from "prop-types";
import { useHistory, Link } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";

function SignIn(props) {
  const { state, dispatch } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const singin = () => {
    fetch("http://localhost:4000/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log("RESULT SIGN IN", result);
        if (result.error) {
          M.toast({ html: result.error, classes: "#e53935 red darken-1" });
        } else {
          localStorage.setItem("jwt", result.token);
          localStorage.setItem("user", JSON.stringify(result.getUser));
          dispatch({ type: "USER", payload: result.getUser });
          M.toast({ html: result.message, classes: "#8bc34a light-green" });
          history.push("/");
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
        onClick={() => singin()}
      >
        Sign In
      </button>
      <h5>
        <Link to="/signup">Don't have an account?</Link>
      </h5>
      <h5>
        <Link to="/reset-password">Forgot password?</Link>
      </h5>
    </div>
  );
}

SignIn.propTypes = {};

export default SignIn;
