import {
  SET_USERDATA,
  IS_LOADING,
  SET_DEPARTMENTS,
  SET_SELECTED_FORM,
  SET_TAB_NAME,
  SET_CHILD_FORM,
  SET_SEARCH_TERM
} from "./action";

const initialState = {
  user: {},
  isLoading: true,
  allDepartments: [],
  selectedForm: {},
  childForm: {},
  tabName: false,
  searchTerm: ""
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERDATA:
      return { ...state, user: action.payload };
    case SET_DEPARTMENTS:
      return { ...state, allDepartments: action.payload };
    case IS_LOADING:
      return { ...state, isLoading: action.payload };
    case SET_SELECTED_FORM:
      return { ...state, selectedForm: action.payload };
    case SET_CHILD_FORM:
      return { ...state, childForm: action.payload };
    case SET_TAB_NAME:
      return { ...state, tabName: action.payload };
    case SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    default:
      return state;
  }
};
