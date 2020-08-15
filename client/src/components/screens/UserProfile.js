import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../App";

function UserProfile(props) {
  const { id } = useParams();
  const { state, dispatch } = useContext(UserContext);

  const [userProfile, setUserProfile] = useState(null);
  const [showFollow, setShowFollow] = useState(
    state ? !state.following.includes(id) : true
  );

  useEffect(() => {
    fetch(`http://localhost:4000/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setUserProfile(result);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {};
  }, []);

  const followers = () => {
    fetch("http://localhost:4000/users/follow/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log("RESULT IN USERPROFILE", result);
        dispatch({
          type: "UPDATE",
          payload: { followers: result.followers, following: result.following },
        });
        localStorage.setItem("user", JSON.stringify(result)); //tra ve cho nguoi ho dang nhap
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, result._id],
            },
          };
        });
        setShowFollow(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unfollowers = () => {
    fetch("http://localhost:4000/users/unfollow/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log("RESULT IN USERPROFILE", result);
        dispatch({
          type: "UPDATE",
          payload: { followers: result.followers, following: result.following },
        });
        localStorage.setItem("user", JSON.stringify(result)); //tra ve cho nguoi ho dang nhap
        setUserProfile((prevState) => {
          let newFollower = prevState.user.followers.filter(
            (item) => item !== result._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {userProfile ? (
        <div className="profile">
          <div className="header-profile">
            <div className="image-profile">
              <img
                src="https://res.cloudinary.com/kh-ng-c/image/upload/v1597264404/hn5wpbwi0mxugj1y9pdj.jpg"
                alt="name"
              />
            </div>
            {/* image-profile */}
            <div className="info-profile">
              <h4>{userProfile.user.name}</h4>
              <h6>{userProfile.user.email}</h6>
              <div className="post-follower-following">
                <p>{userProfile.post.length} Posts</p>
                <p>{userProfile.user.followers.length} Followers</p>
                <p>{userProfile.user.following.length} Followring</p>
              </div>
              {/* post-follower-following */}
              {showFollow ? (
                <button
                  onClick={() => followers()}
                  className="btn waves-effect waves-light"
                >
                  follow
                </button>
              ) : (
                <button
                  onClick={() => unfollowers()}
                  className="btn waves-effect waves-light"
                >
                  unfollow
                </button>
              )}
            </div>
            {/* info-profile */}
          </div>
          <div className="list-profile">
            {userProfile.post.map((item) => {
              return <img key={item._id} src={item.photo} alt={item.title} />;
            })}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default UserProfile;
