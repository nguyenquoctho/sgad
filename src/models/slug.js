import { API_URL_COMPANY } from "../setting"
import axios from "axios"
import { Cookies } from "react-cookie"

const cookies = new Cookies()
const slug = {
  state: {
    isExist: "",
  },
  reducers: {
    setState(state, payload) {
      state = { ...state, ...payload }
      return { ...state }
    },
  },
  effects: dispatch => ({
    async checkSlug(payload, rootState) {
      let current = this
      await axios
        .get(API_URL_COMPANY + "/slug/check", {
          params: payload,
          headers: { Authorization: cookies.get("token") },
        })
        .then(response => {
          if (response.data.code === 1) {
            current.setState({ isExist: "true" })
          } else {
            current.setState({ isExist: "false" })
          }
        })
    },
    addSlug(payload, rootState) {
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/slug/add",
        data: payload,
        headers: { Authorization: cookies.get("token") },
      })
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteSlug(payload, rootState) {
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/slug/delete",
        data: payload,
        headers: { Authorization: cookies.get("token") },
      })
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    updateSlug(payload, rootState) {
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/slug/update",
        data: payload,
        headers: { Authorization: cookies.get("token") },
      })
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
  }),
}

export default slug
