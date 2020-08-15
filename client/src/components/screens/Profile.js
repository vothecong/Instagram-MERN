import React, { useContext, useEffect, useState } from "react";
// import PropTypes from "prop-types";
import { UserContext } from "../../App";

function Profile(props) {
  const { state, dispatch } = useContext(UserContext);

  const [listPost, setListPost] = useState([]);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/contents/mypost", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setListPost(result);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {};
  }, []);

  //update avartar
  useEffect(() => {
    if (image) {
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
          fetch("http://localhost:4000/users/update-avatar", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              photo: result.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log("RESULT IN UPDATE AVATAR",result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, avatar: result.avatar })
              );
              dispatch({
                type: "UPDATE_AVARTAR",
                payload: result.avatar,
              });
              window.location.reload();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return () => {};
  }, [image]);

  const updateAvatar = (file) => {
    setImage(file);
  };

  return (
    <>
      {state ? (
        <div className="profile">
          <div className="header-profile">
            <div className="image-profile">
              <img src={state.avatar} alt="name" />
              <div className="file-field input-field">
                <div className="btn">
                  <span>Image</span>
                  <input
                    type="file"
                    onChange={(e) => updateAvatar(e.target.files[0])}
                  />
                </div>
                <div className="file-path-wrapper">
                  <input className="file-path validate" type="text" />
                </div>
              </div>
            </div>
            {/* image-profile */}
            <div className="info-profile">
              <h4>{state.name}</h4>
              <h6>{state.email}</h6>
              <div className="post-follower-following">
                <p>{listPost.length} Posts</p>
                <p>{state.followers.length} Followers</p>
                <p>{state.following.length} Following</p>
              </div>
              {/* post-follower-following */}
            </div>
            {/* info-profile */}
          </div>
          <div className="list-profile">
            {listPost.map((item) => {
              return <img key={item._id} src={item.photo} alt={item.title} />;
            })}
          </div>
        </div>
      ) : (
        <div>Loadding</div>
      )}
    </>
  );
}

export default Profile;
