import React from "react"
import Paper from "@material-ui/core/Paper"
import Icon from "@material-ui/core/Icon"
import IconButton from "@material-ui/core/IconButton"
import CircularProgress from "@material-ui/core/CircularProgress"
import { connect } from "react-redux"
import "./style.css"
class ImageItem extends React.Component {
  constructor(props) {
    super(props)
    this.deleteImage = this.deleteImage.bind(this)
  }
  deleteImage() {
    let data = {
      imageUrl: this.props.url,
      type: this.props.type,
    }

    this.props.deleteImage(data)
    if (this.props.type === "house") {
      this.props.deleteHouseImage(this.props.url)
    } else if (this.props.type === "project") {
      this.props.deleteProjectImage(this.props.url)
    } else if (this.props.type === "setting") {
      if (this.props.logo) {
        this.props.deleteCompanyLogo(this.props.url)
      } else {
        this.props.deleteSlideImages(this.props.url)
      }
    } else if (this.props.type === "blog") {
      this.props.deleteBlogImage()
    }
  }
  render() {
    let preview
    let loading
    if (!this.props.url || this.props.url === "") {
      preview = <p>No Image</p>
    } else {
      preview = <img src={this.props.url} />
    }
    if (this.props.imageLoading) {
      loading = (
        <div className="progress-upload">
          <CircularProgress color="secondary" />
        </div>
      )
    } else {
      loading = ""
    }
    return (
      <div className="image-item d-flex flex-column align-items-center justify-content-center">
        {loading}
        <div className={"preview"}>{preview}</div>
        <div className={"footer"}>
          <IconButton
            touch={true}
            tooltip={"Edit"}
            tooltipPosition="top-right"
            onClick={""}
          >
            <Icon className="material-icons">create</Icon>
          </IconButton>
          <IconButton
            touch={true}
            tooltip={"Delete"}
            tooltipPosition="top-right"
            onClick={this.deleteImage}
          >
            <Icon className="material-icons">delete</Icon>
          </IconButton>
        </div>
      </div>
    )
  }
}
const mapState = state => ({
  imageLoading: state.upload.imageLoading,
})
const mapDispatch = dispatch => ({
  deleteImage: dispatch.upload.deleteImage,
  deleteProjectImage: dispatch.projects.deleteProjectImage,
  deleteSlideImages: dispatch.settings.deleteSlideImages,
  deleteCompanyLogo: dispatch.settings.deleteCompanyLogo,
  deleteBlogImage: dispatch.blogs.deleteBlogImage,
})
export default connect(
  mapState,
  mapDispatch
)(ImageItem)
