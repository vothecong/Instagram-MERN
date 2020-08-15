import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../App";

function Navbar(props) {
  const searchModal = useRef(null);

  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [listSearch, setListSearch] = useState([]);

  useEffect(() => {
    M.Modal.init(searchModal.current);
    return () => {};
  }, []);

  const renderList = () => {
    if (state) {
      return [
        <li>
          <div>
            <i
              data-target="modal1"
              className="material-icons modal-trigger"
              style={{ color: "black", cursor: "pointer" }}
            >
              search
            </i>
          </div>
        </li>,
        <li>
          <Link to="/profile">Profile</Link>
        </li>,
        <li>
          <Link to="/create-post">Create Post</Link>
        </li>,
        <li>
          <Link to="/my-post-subscribe">My Posts Subscribe</Link>
        </li>,
        <li>
          <button
            className="btn waves-effect red"
            type="submit"
            name="action"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/signin">SignIn</Link>
        </li>,
        <li>
          <Link to="/signup">SignUp</Link>
        </li>,
      ];
    }
  };

  const searchUser = (text) => {
    setSearch(text);
    fetch("http://localhost:4000/users/search-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        search,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setListSearch(result.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <nav>
      <div className="nav-wrapper">
        <Link to={state ? "/" : "/signin"} className="brand-logo">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {renderList()}
        </ul>
      </div>
      <div
        id="modal1"
        className="modal"
        ref={searchModal}
        style={{ color: "black" }}
      >
        <div className="modal-content">
          <h4>Search User</h4>
          <input
            type="text"
            placeholder="search user"
            required
            value={search}
            onChange={(e) => searchUser(e.target.value)}
          />
          <ul className="collection">
            {listSearch &&
              listSearch.map((x) => {
                return (
                  <li key={x._id} className="collection-item">
                    <Link
                      onClick={() =>
                        M.Modal.getInstance(searchModal.current).close()
                      }
                      to={
                        state._id === x._id ? "/profile" : `/profile/${x._id}`
                      }
                    >
                      {" "}
                      {x.email}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="modal-footer">
          <p className="modal-close ">Close</p>
        </div>
      </div>
    </nav>
  );
}

// Navbar.propTypes = {};

export default Navbar;
