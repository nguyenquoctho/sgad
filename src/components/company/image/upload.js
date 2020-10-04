import React from "react"
import Dropzone from "react-dropzone"
import ImageItem from "./index"
import Button from "@material-ui/core/Button"
import { connect } from "react-redux"
class Uploader extends React.Component {
  constructor(props) {
    
    super(props)
    this.onDrop = this.onDrop.bind(this)
  }

  async onDrop(files) {
    console.log(files)
    
    if (this.props.logo) {
      for(let i = 0; i < files.length; i++) {
        let formData = new FormData()
        formData.append("type", this.props.type)
        formData.append("file", files[i])
        await this.props.uploadLogo(formData)
      }
     
    } else if (this.props.blog) {
      for(let i = 0; i < files.length; i++) {
        let formData = new FormData()
        formData.append("type", this.props.type)
        formData.append("file", files[i])
        await this.props.uploadBlogImages(formData)
      }
      
    } else {
      for(let i = 0; i < files.length; i++) {
        let formData = new FormData()
        formData.append("type", this.props.type)
        formData.append("file", files[i])
        await this.props.uploadImage(formData)
      }
    }
  }

  render() {
    return (
      <Dropzone onDrop={this.onDrop}>
        {({ getRootProps, getInputProps }) => (
          <section className="container">
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()}/>
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside></aside>
          </section>
        )}
      </Dropzone>
    )
  }
}
const mapState = state => ({})
const mapDispatch = dispatch => ({
  uploadImage: dispatch.upload.uploadImage,
  deleteImage: dispatch.upload.deleteImage,
  loadHouseById: dispatch.houses.loadHouseById,
  editHouse: dispatch.houses.editHouse,
  uploadLogo: dispatch.upload.uploadLogo,
  uploadBlogImages: dispatch.upload.uploadBlogImages,
})
export default connect(
  mapState,
  mapDispatch
)(Uploader)
