import React, { useEffect, useState, useContext } from "react";
// import PropTypes from "prop-types";
import HomeItem from "./HomeItem";
import { UserContext } from "../../App";
import M from "materialize-css";
import { useHistory } from "react-router-dom";

function Home(props) {
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);
  const history = useHistory();
  useEffect(() => {
    fetch("http://localhost:4000/contents/getPostSubsribe", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log("GET POST SUBSCRIBE RESULT", result);
        setData(result);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {};
  }, []);

  const like = (id) => {
    fetch("http://localhost:4000/contents/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        likeId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch("http://localhost:4000/contents/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        likeId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (id) => {
    fetch(`http://localhost:4000/contents/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        M.toast({
          html: result.message,
          classes: "#7cb342 light-green darken-1",
        });
        let newData = data.filter((x) => x._id !== result.result._id);
        setData(newData);
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const commentPost = (text, postId) => {
    fetch("http://localhost:4000/contents/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log("RESULT BY COMMENT",result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="content">
      {data.map((item, index) => {
        return (
          <HomeItem
            key={index}
            item={item}
            state={state}
            like={(id) => like(id)}
            unlikePost={(id) => unlikePost(id)}
            deletePost={(id) => deletePost(id)}
            commentPost={(text, id) => commentPost(text, id)}
          />
        );
      })}
    </div>
  );
}

Home.propTypes = {};

export default Home;
