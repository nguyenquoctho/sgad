import { API_URL_COMPANY, BASE_URL, limitPerRequest } from "../setting"
import axios from "axios"
import { Cookies } from "react-cookie"
const tokenExpires = 12 * 3600 * 1000 //12 hours
const cookies = new Cookies()
let companyCode
if (cookies.get("user")) {
  companyCode = {
    companyCode: cookies.get("user").companyCode,
  }
}
const blogCategories = {
  state: {
    blogCategories: [],
  },
  reducers: {
    setState(state, payload) {
      state = { ...state, ...payload }
      return state
    },
  },
  effects: dispatch => ({
    loadAllCategories(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios
        .get(API_URL_COMPANY + "/blogCategories", {
          params: payload,
          headers: {
            Authorization: cookies.get("token"),
          },
        })
        .then(response => {
          dispatch.dialog.setState({ loading: false })
          current.setState({ blogCategories: response.data })
        })
        .catch(error => console.log(error))
    },
    addCategories(payload, rootState) {
      let current = this
      dispatch.dialog.setState({ loading: true })
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/blogCategories/add",
        headers: {
          Authorization: cookies.get("token"),
        },
        data: payload,
      })
        .then(response => {
          dispatch.dialog.setState({ loading: false })
          console.log(response.data)
        })
        .catch(error => console.log(error))
    },
    loadCategoriesById(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios
        .get(API_URL_COMPANY + "/blogCategories/get", {
          params: { id: payload },
          headers: {
            Authorization: cookies.get("token"),
          },
        })
        .then(response => {
          dispatch.dialog.setState({ loading: false })
          current.setState({ blogById: response.data })
          current.setState({ blogImage: response.data.image })
        })
        .catch(error => console.log(error))
    },
  
    updateCategories(payload, rootState) {
      let current = this
      dispatch.dialog.setState({ loading: true })
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/blogCategories/update",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          dispatch.dialog.setState({ loading: false })
        })
        .catch(error => console.log(error))
    },
    deleteCategories(payload, rootState) {
      let current = this
      dispatch.dialog.setState({ loading: true })
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/blogCategories/delete",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          console.log(response.data)
          dispatch.dialog.setState({ loading: true })
        })
        .catch(error => console.log(error))
    },
  }),
}
export default blogCategories
