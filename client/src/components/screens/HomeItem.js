import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
function HomeItem(props) {
  const { item, state } = props;
  const [text, setText] = useState("");

  return (
    <div>
      <div className="card card-item">
        <div className="card-title">
          <h5>
            <Link
              to={
                state._id === item.postedBy._id
                  ? "/profile"
                  : `/profile/${item.postedBy._id}`
              }
            >
              {item.postedBy.name}
            </Link>{" "}
            {state._id === item.postedBy._id && (
              <i
                style={{ fontSize: "30px", cursor: "pointer" }}
                className="large material-icons"
                onClick={() => {
                  props.deletePost(item._id);
                }}
              >
                delete
              </i>
            )}
          </h5>
        </div>
        <div className="card-image">
          <img src={item.photo} alt="image" />
        </div>
        <div className="button">
          <div style={{ marginRight: "5px" }}>
            <i
              style={{ fontSize: "30px", cursor: "pointer", color: "red" }}
              className="large material-icons"
            >
              favorite
            </i>
            <br />
            <span>{item.likes.length} likes</span>
          </div>
          {item.likes.includes(state._id) ? (
            <i
              style={{
                fontSize: "30px",
                cursor: "pointer",
                marginRight: "5px",
              }}
              className="large material-icons"
              onClick={() => props.unlikePost(item._id)}
            >
              thumb_down
            </i>
          ) : (
            <i
              style={{
                fontSize: "30px",
                cursor: "pointer",
                marginRight: "5px",
              }}
              className="large material-icons"
              onClick={() => props.like(item._id)}
            >
              thumb_up
            </i>
          )}
        </div>
        <div className="card-content">
          <h5>{item.title}</h5>
          <p>{item.description}</p>
        </div>
        <div className="card-action">
          {item.comments.map((x) => {
            return (
              <div className="comment-home" key={x._id}>
                <h6>
                  <Link
                    to={
                      state._id === item.postedBy._id
                        ? "/profile"
                        : `/profile/${item.postedBy._id}`
                    }
                    style={{ color: "black", textTransform: "capitalize" }}
                  >
                    {x.postedBy.name}
                  </Link>
                </h6>
                <span>{x.text}</span>
              </div>
            );
          })}
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault(e);
                // console.log(e.target[0].value + "  " + item._id);
                props.commentPost(e.target[0].value, item._id);
                setText("");
              }}
            >
              <input
                id="email_inline"
                type="text"
                className="validate"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </form>
          </div>
        </div>
      </div>
      {/* card card-item */}
    </div>
  );
}

HomeItem.propTypes = {};

export default HomeItem;
