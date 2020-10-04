import { API_URL_ADMIN, Authorization, SecretToken } from "../setting"
import axios from "axios"
import { Cookies } from "react-cookie"
const tokenExpires = 12 * 3600 * 1000 //12 hours
const cookies = new Cookies()
const users = {
  state: {
    users: [],
    userById: {},
    userEdit: {},
    alert: false,
    alertMessage: "",
  },
  reducers: {
    setState(state, payload) {
      state = { ...state, ...payload }
      return { ...state }
    },
    setUserEdit(state, payload) {
      state.userEdit = { ...state.userEdit, ...payload }
      return { ...state }
    },
  },
  effects: dispatch => ({
    loadUsers(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios
        .get(API_URL_ADMIN + "/users", {
          headers: { Authorization: cookies.get("token") },
        })
        .then(function(response) {
          current.setState({ users: response.data })
          dispatch.dialog.setState({ loading: false })
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    loadUserById(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios
        .get(
          API_URL_ADMIN + "/users/get",
          {
            params: {
              id: payload,
            },
            headers: { Authorization: cookies.get("token") },
          },
         
        )
        .then(function(response) {
          dispatch.dialog.setState({ loading: false })
          current.setState({ userEdit: response.data })
        })
    },
    addUser(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios({
        method: "post",
        url: API_URL_ADMIN + "/users",
        data: payload,
        headers: { Authorization: cookies.get("token") }
      })
        .then(function(response) {
          dispatch.dialog.setState({ loading: false })
          console.log("add success")
          current.setState({ alert: true, alertMessage: "Added new user!" })
          current.loadUsers()
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    editUser(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios({
        method: "post",
        url: API_URL_ADMIN + "/users",
        data: payload,
        headers: { Authorization: cookies.get("token") }
      })
        .then(function(response) {
          dispatch.dialog.setState({ loading: false })
          console.log("update success")
          current.setState({ alert: true, alertMessage: "Edited user!" })
          current.loadUsers()
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    deleteUser(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      let url = API_URL_ADMIN + "/users/delete"
      axios({
        method: "post",
        url: url,
        data: {
          id: payload,
        },
        headers: { Authorization: cookies.get("token") }
      })
        .then(response => {
          dispatch.dialog.setState({ loading: true })
          console.log("Delelted")
          current.setState({ alert: true, alertMessage: "Deleted user!" })
          this.loadUsers()
        })
        .catch(error => console.log(error))
    },
    resetPassword(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios({
        method: "post",
        url: API_URL_ADMIN + "/users/resetPassword",
        data: {
          id: payload,
        },
        headers: { Authorization: cookies.get("token") }
      })
        .then(response => {
          dispatch.dialog.setState({ loading: false })
          current.setState({ alert: true, alertMessage: "Reset password!" })
          console.log("Reset success!")
          current.loadUsers()
        })
        .catch(error => console.log(error))
    },
  }),
}

export default users
