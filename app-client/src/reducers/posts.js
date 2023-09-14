import { FETCH_ALL, FETCH_POST, FETCH_BY_SEARCH, CREATE, UPDATE, DELETE, LIKE, START_LOADING, END_LOADING, COMMENT} from '../constants/actionTypes';

// export default (state = [{ isLoading: true, posts: [] }], action) => {
export default (state = { isLoading: true, posts: [] }, action) => {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, isLoading: true }
      
    case 'END_LOADING':
      return { ...state, isLoading: false }

    case FETCH_ALL:
      return{
        ...state,
        posts: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
      };

    case FETCH_POST:
    // return { ...state, post: action.payload };// affiche les details d'un post
    return { ...state, post: action.payload.post };// affiche les details d'un post

    case FETCH_BY_SEARCH:
    // return { ...state, posts: action.payload }; //affiche les données du post
    return { ...state, posts: action.payload.data }; //affiche les données du post

    case LIKE:
      return { ...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post))};

    case CREATE:
      return { ...state, posts: [...state.posts, action.payload]};

    case UPDATE:
      return { ...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post))};

    case DELETE:
      return { ...state, posts: state.posts.filter((post) => post._id !== action.payload)};

    case COMMENT:
      return { 
        ...state, 
        posts: state.posts.map((post) => {
        // change just le post qui vient de recevoir un commentaire
        if(post._id === +action.payload._id) {
          return action.payload;
        }
        // retourne tous les autres postes normalement
        return post;
        }),
      };

    default:
      return state;
  }
};