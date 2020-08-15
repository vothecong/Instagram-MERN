const initialState = null;

const reducer = (state, action) => {
  if (action.type === "USER") {
    return action.payload;
  }
  if (action.type === "CLEAR") {
    return null;
  }
  if (action.type === "UPDATE") {
    return {
      ...state,
      followers: action.payload.followers,
      following: action.payload.following,
    };
  }
  if(action.type ==="UPDATE_AVARTAR"){
    return {
      ...state,
      avatar: action.payload
    }
  }
  return state;
};

export { initialState, reducer };
