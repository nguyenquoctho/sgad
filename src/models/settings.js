import { API_URL_COMPANY, BASE_URL, API_URL_PUBLIC } from "../setting"
import axios from "axios"
import { Cookies } from "react-cookie"
const tokenExpires = 12 * 3600 * 1000 //12 hours
const cookies = new Cookies()
const settings = {
  state: {
    settings: {
      companyName: "",
      companyAdrress: "",
      companyPhone: "",
      companyWebsite: "",
      companyCopyright: "",
      companyLogo: "",
      companyWorkTime: "",
      slideImages: [],
      totalProperties: "",
      totalUser: "",
      totalHouse: 0,
      totalProject: 0,
      preFixHouse: "",
      preFixProject: "",
    },
    slideImages: [],
    hotProject: [],
    companyLogo: "",
    apiKey: "",
  },
  reducers: {
    setState(state, payload) {
      state = { ...state, ...payload }
      return { ...state }
    },
    addSlideImages(state, payload) {
      state.slideImages = [...state.slideImages, payload]
      return { ...state }
    },
    deleteSlideImages(state, payload) {
      state.slideImages = state.slideImages.filter(item => {
        return item != payload
      })
      return { ...state }
    },
    addCompanyLogo(state, payload) {
      state.companyLogo = payload
      return { ...state }
    },
    deleteCompanyLogo(state, payload) {
      state.companyLogo = ""
      return { ...state }
    },
    addHotProject(state, payload) {
      state.hotProject = [...state.hotProject, payload]
      return { ...state }
    },
    deleteHotProject(state, payload) {
      state.hotProject = state.hotProject.filter(item => {
        return item._id != payload._id
      })
      return { ...state }
    },
    handleInputChange(state, payload) {
      state.settings = { ...state.settings, ...payload }
      return { ...state }
    },
    setTotalHouses(state, payload) {
      state.settings.totalHouse = payload
      return { ...state }
    },
    setTotalProjects(state, payload) {
      state.settings.totalProject = payload
      return { ...state }
    }
  },
  effects: dispatch => ({
    async loadSettings(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      await axios
        .get(API_URL_COMPANY + "/settings", {
          params: payload,
          headers: {
            Authorization: cookies.get("token"),
          },
        })
        .then(response => {
          dispatch.dialog.setState({ loading: false })
          current.setState({
            settings: response.data,
            slideImages: response.data.slideImages,
            companyLogo: response.data.companyLogo,
            hotProject: response.data.hotProject,
            apiKey: response.data.apiKey,
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    updateSettings(payload, rootState) {
      dispatch.dialog.setState({ loading: true })
      let current = this
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/settings/update",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          console.log(response.data)
          dispatch.dialog.setState({ loading: false })
        })
        .catch(error => console.log(error))
    },
    generateApiKey(payload, rootState) {
      axios({
        method: "POST",
        url: API_URL_PUBLIC + "/apikey",
        data: payload,
      }).then(response => {
        this.setState({ apiKey: response.data })
      })
    },
    updateTotalHouse(payload, rootState) {
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/settings/updateTotalHouse",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    },
    updateTotalProject(payload, rootState) {
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/settings/updateTotalProject",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    },
  }),
}
export default settings
