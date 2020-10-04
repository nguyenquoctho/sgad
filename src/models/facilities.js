import { API_URL_COMPANY } from "../setting"
import axios from "axios"
import { Cookies } from "react-cookie"
const tokenExpires = 12 * 3600 * 1000 //12 hours
const cookies = new Cookies()
const facilities = {
  state: {
    facilities: [],
  },
  reducers: {
    setState(state, payload) {
      state = { ...state, ...payload }
      return { ...state }
    },
  },
  effects: {
    loadFacilities(payload, rootState) {
      let current = this
      axios
        .get(API_URL_COMPANY + "/facilities", {
          headers: {
            Authorization: cookies.get("token"),
          },
        })
        .then(response => {
          current.setState({ facilities: response.data })
        })
        .catch(error => console.log(error))
    },
  },
}
export default facilities
