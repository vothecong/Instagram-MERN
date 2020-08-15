import React, { useContext, createContext, useReducer, useEffect } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/screens/Home";
import SignIn from "./components/screens/SignIn";
import SignUp from "./components/screens/SignUp";
import Profile from "./components/screens/Profile";
import CreatePost from "./components/screens/CreatePost";
import SubscribesUserPosts from "./components/screens/SubscribesUserPosts";

import { reducer, initialState } from "./reducers/userReducer";
import UserProfile from "./components/screens/UserProfile";
import ResetPassword from "./components/screens/ResetPassword";
import UpdatePassword from "./components/screens/UpdatePassword";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();

  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      // history.push("/");
    } else {
      if (!history.location.pathname.startsWith("/reset-password")) {
        history.push("/signin");
      }
    }
    return () => {};
  }, []);

  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/profile/:id" component={UserProfile} />
      <Route path="/create-post" component={CreatePost} />
      <Route path="/my-post-subscribe" component={SubscribesUserPosts} />
      <Route path="/reset-password" exact component={ResetPassword} />
      <Route path="/reset-password/:token" component={UpdatePassword} />
    </Switch>
  );
};

function App(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
