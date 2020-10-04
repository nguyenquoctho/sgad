import { API_URL_COMPANY, BASE_URL } from "../setting"
import axios from "axios"
import { Cookies } from "react-cookie"
const cookies = new Cookies()
const upload = {
  state: {
    storageUrl: "",
    imageLoading: false,
    logoImage: "",
  },
  reducers: {
    setState(state, payload) {
      state = { ...state, ...payload }
      return { ...state }
    },
    setHouseImages(state, payload) {
      state.houseImages = [...state.houseImages, payload]
      return { ...state }
    },
  },
  effects: dispatch => ({
    async uploadImage(payload, rootState) {
      let current = this
      dispatch.loader.show()
      await axios({
        method: "POST",
        url: API_URL_COMPANY + "/upload",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          current.setState({
            storageUrl: response.data,
            imageLoading: false,
          })
          dispatch.houses.addImages(response.data)
          dispatch.projects.addProjectImage(response.data)
          dispatch.settings.addSlideImages(response.data)
          dispatch.loader.hide()
        })
        .catch(error => {
          dispatch.loader.hide()
          console.log(error)
        })
    },
    uploadLogo(payload, rootState) {
      let current = this
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/upload",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          current.setState({
            logoImage: response.data,
          })
          dispatch.settings.addCompanyLogo(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    async uploadBlogContentImages(payload, rootState) {
      dispatch.loader.show()
      let current = this
      await axios({
        method: "POST",
        url: API_URL_COMPANY + "/upload",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          dispatch.blogs.addContentImage(response.data)
          dispatch.dialog.setState({ loading: false })
        })
        .catch(error => {
          console.log(error)
        })
    },
    async uploadBlogImages(payload, rootState) {
      let current = this
      await axios({
        method: "POST",
        url: API_URL_COMPANY + "/upload",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(async function(response) {
          await dispatch.blogs.addBlogImage(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteImage(payload, rootState) {
      dispatch.loader.show()
      let current = this
      axios({
        method: "POST",
        url: API_URL_COMPANY + "/upload/delete",
        data: payload,
        headers: {
          Authorization: cookies.get("token"),
        },
      })
        .then(response => {
          dispatch.loader.hide()
          current.setState({
            storageUrl: "undefine",
            imageLoading: false,
          })
        })
        .catch(error => {
          dispatch.loader.hide()
          console.log(error)
        })
    },
  }),
}
export default upload
