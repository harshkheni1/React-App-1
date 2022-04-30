// We speciify the name of the action as a variable
export const SET_USERDATA = "SET_USERDATA";
export const IS_LOADING = "IS_LOADING";
export const SET_DEPARTMENTS = "SET_DEPARTMENTS";
export const SET_SELECTED_FORM = "SET_SELECTED_FORM";
export const SET_TAB_NAME = "SET_TAB_NAME";
export const SET_CHILD_FORM = "SET_CHILD_FORM";
export const SET_SEARCH_TERM = "SET_SEARCH_TERM";

export const setUserData = (data) => {
  return {
    type: SET_USERDATA,
    payload: data
  };
};
export const setDepartmentsData = (data) => {
  return {
    type: SET_DEPARTMENTS,
    payload: data
  };
};
export const setLoader = (data) => {
  return {
    type: IS_LOADING,
    payload: data
  };
};
export const setSelectedForm = (data) => {
  return {
    type: SET_SELECTED_FORM,
    payload: data
  };
};
export const setChildForm = (data) => {
  return {
    type: SET_CHILD_FORM,
    payload: data
  };
};
export const setTabName = (data) => {
  return {
    type: SET_TAB_NAME,
    payload: data
  };
};

export const setSearchTerm = (data) => {
  return {
    type: SET_SEARCH_TERM,
    payload: data
  };
};
// export const getUpdateCount = (count)=> dispatch =>{
//     count += 1;
//     dispatch(setUpdateCount(count));
// }
