import React from "react"
import Layout from "../../../../components/layout"
import SEO from "../../../../components/seo"
import {
  BASE_URL,
  API_URL,
  EDITOR_API,
  blogCategories,
  limitPerRequest,
} from "../../../../setting"
import { Button } from "@material-ui/core"
import "date-fns"
import DateFnsUtils from "@date-io/date-fns"
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers"
import Checkbox from "@material-ui/core/Checkbox"
import "../style.css"
import Swal from "sweetalert2"
import ImageItem from "../../../../components/company/image/index"
import Uploader from "../../../../components/company/image/upload"
import { Editor } from "@tinymce/tinymce-react"
import { connect } from "react-redux"
import { Cookies } from "react-cookie"
import { navigate } from "gatsby"
import slug from "slug"

const cookies = new Cookies()
let companyCode = { companyCode: "" }
if (cookies.get("user")) {
  companyCode = {
    companyCode: cookies.get("user").companyCode,
  }
}

class AddBlog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      apiKey: "",
      content: "",
      selectedDate: new Date().getTime(),
      schedule: false,
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handContent = this.handContent.bind(this)
    this.uploadContentImage = this.uploadContentImage.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
  }

  componentDidMount() {
    this.props.selectMenu({ index: 5 })
    this.props.loadAllCategories()
  }
  handleInputChange(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value,
    })
  }
  handleDateChange(date) {
    this.setState({ selectedDate: date.getTime() })
  }
  handContent(content, editor) {
    this.setState({ content: content })
  }
  uploadContentImage(cb, value, meta) {
    let current = this
    var input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")
    input.onchange = async function() {
      var file = this.files[0]
      let formData = new FormData()
      formData.append("file", file)
      formData.append("type", "blog")
      await current.props.uploadBlogContentImages(formData)
      await cb(current.props.contentImages)
    }
    input.click()
  }
  handleSave(event) {
    event.preventDefault()
    let data = {
      blogCode: this.state.blogCode || "",
      title: this.state.title || "",
      slug: slug(this.state.title, { lower: true }),
      description: this.state.description || "",
      companyCode: companyCode.companyCode,
      language: this.state.language || "",
      project: this.state.project || "",
      feature: this.state.feature || "",
      content: this.state.content || "",
      image: this.props.blogImage || "",
      category: this.state.category || "",
      date_post: this.state.selectedDate,
      writtenBy: `${cookies.get("user").firstName} ${
        cookies.get("user").lastName
      }`,
    }
    this.props.addBlog(data)
  }
  render() {
    if (this.props.success === true) {
      Swal.fire({
        title: "Success!",
        text: "Your blog is created",
        type: "success",
        confirmButtonText: "Ok",
        onClose: async () => {
          await this.props.setBlogState({ success: false })
          navigate(`/company/blog?page=${this.props.query.page}`)
        },
      })
    } else if (this.props.error === true) {
      Swal.fire({
        title: "Failed!",
        text: "Your blog can't be saved",
        type: "error",
        confirmButtonText: "Ok",
        onClose: () => {
          this.props.setBlogState({ error: false })
        },
      })
    }
    return (
      <Layout role="company">
        <SEO title="Blogs" />
        <div
          class={
            "main-content-wrap d-flex flex-column " + this.props.contentStatus
          }
        >
          <div class="breadcrumb d-flex justify-content-between">
            <h1>Blogs</h1>
          </div>
          <div class="separator-breadcrumb border-top"></div>
          <div class="card text-left">
            <div className="card-body">
              <form onSubmit={this.handleSave}>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">Title</label>
                  <input
                    type="text"
                    onChange={this.handleInputChange}
                    name="title"
                    required
                    class="form-control"
                  />
                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">Description</label>
                  <input
                    name="description"
                    type="text"
                    required
                    onChange={this.handleInputChange}
                    class="form-control"
                  />
                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">Company Code</label>
                  <input
                    type="text"
                    value={companyCode.companyCode}
                    name="companyCode"
                    class="form-control"
                    disabled
                  />
                </div>
                <div class="col-md-12 form-group mb-3 d-flex">
                  <div
                    class="col-md-3 form-group mb-3"
                    style={{ paddingLeft: "0px" }}
                  >
                    <label className="input-label">Language</label>
                    <input
                      type="text"
                      onChange={this.handleInputChange}
                      required
                      name="language"
                      class="form-control"
                    />
                  </div>
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">Project</label>
                    <input
                      type="text"
                      onChange={this.handleInputChange}
                      name="project"
                      class="form-control"
                    />
                  </div>
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">Feature</label>
                    <select
                      type="text"
                      onChange={this.handleInputChange}
                      name="feature"
                      required
                      class="form-control"
                    >
                      <option value={""}>Feature</option>
                      <option value={true}>True</option>
                      <option value={false}>False</option>
                    </select>
                  </div>
                  <div class="col-md-3 form-group mb-3">
                    <label className="input-label">Category</label>
                    <select
                      type="text"
                      onChange={this.handleInputChange}
                      name="category"
                      required
                      class="form-control"
                    >
                      <option value={""}>Category</option>
                      {this.props.blogCategories.map(category => {
                        return (
                          <option value={category.name}>{category.name}</option>
                        )
                      })}
                    </select>
                  </div>
                </div>
                <div class="col-md-12 form-group mb-3">
                  <label className="input-label">Content</label>
                  <Editor
                    apiKey={EDITOR_API}
                    init={{
                      height: "500px",
                      plugins: [
                        " autolink lists link image charmap preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "media table paste code textcolor directionality",
                      ],
                      toolbar1:
                        " image media | styleselect | bold italic bullist numlist link alignleft aligncenter alignright alignjustify format",
                      toolbar2:
                        "undo redo | forecolor paste removeformat table | outdent indent | preview code",
                      image_title: true,
                      automatic_uploads: true,
                      file_picker_types: "image",
                      file_picker_callback: this.uploadContentImage,
                    }}
                    onEditorChange={this.handContent}
                  />
                </div>
                <div class="col-md-12 form-group mb-3 d-flex flex-column">
                  <label className="input-label">Image</label>
                  <Uploader type={"blog"} blog={true} />
                  <div className="d-flex flex-wrap">
                    <ImageItem
                      url={this.props.blogImage}
                      type={"blog"}
                      logo={true}
                    />
                  </div>
                </div>
                <div class="col-md-6 form-group mb-3 d-flex flex-column">
                  <div className="d-flex align-items-center">
                    <label className="input-label">Schedule date post</label>
                    <Checkbox
                      checked={this.state.schedule}
                      onChange={this.handleInputChange}
                      color="primary"
                      name="schedule"
                      inputProps={{
                        "aria-label": "secondary checkbox",
                      }}
                    />
                  </div>

                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                      inputVariant="filled"
                      disabled={!this.state.schedule}
                      value={this.state.selectedDate}
                      onChange={this.handleDateChange}
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <Button variant="contained" type="submit" color="primary">
                  Save
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
const mapState = state => ({
  contentStatus: state.menu.contentStatus,
  contentImages: state.blogs.contentImages,
  blogImage: state.blogs.blogImage,
  blogCategories: state.blogCategories.blogCategories,
  loading: state.dialog.loading,
  success: state.blogs.success,
  query: state.blogs.query,
  error: state.blogs.error,
  numberOfBlogs: state.blogs.numberOfBlogs,
})
const mapDispatch = dispatch => ({
  selectMenu: dispatch.menu.setState,
  addBlog: dispatch.blogs.addBlog,
  loadAllCategories: dispatch.blogCategories.loadAllCategories,
  uploadBlogContentImages: dispatch.upload.uploadBlogContentImages,
  setBlogState: dispatch.blogs.setState,
})
export default connect(mapState, mapDispatch)(AddBlog)
