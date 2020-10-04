import { API_URL_COMPANY, BASE_URL } from "../setting"
import axios from "axios"
import { Cookies } from "react-cookie"
const tokenExpires = 12 * 3600 * 1000 //12 hours
const cookies = new Cookies()
const amenities = {
  state: {
    amenities: [],
  },
  reducers: {
    setState(state, payload) {
      state = { ...state, ...payload }
      return { ...state }
    },
  },
  effects: {
    loadAmenities(payload, rootState) {
      let current = this
      axios
        .get(API_URL_COMPANY + "/amenities", {
          headers: {
            Authorization: cookies.get("token"),
          },
        })
        .then(response => {
          current.setState({ amenities: response.data })
        })
        .catch(error => console.log(error))
    },
  },
}
export default amenities
