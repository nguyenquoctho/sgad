import React from "react"
import Layout from "../../../../components/layout"
import SEO from "../../../../components/seo"
import {
  BASE_URL,
  API_URL,
  EDITOR_API,
  blogCategories,
} from "../../../../setting"
import { Button } from "@material-ui/core"
import DateFnsUtils from "@date-io/date-fns"
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers"
import Checkbox from "@material-ui/core/Checkbox"
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

class EditBlog extends React.Component {
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
    let blogId = new URL(window.location.href).searchParams.get("id")
    this.props.loadBlogById(blogId)
    this.props.loadAllCategories()
  }
  handleInputChange(event) {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name
    this.props.setBlogById({ [name]: value })
    this.setState({ [name]: value })
  }
  handContent(content, editor) {
    this.props.setBlogById({ content: content })
  }
  handleDateChange(date) {
    this.props.setBlogById({ date_post: date.getTime() })
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
  async handleSave() {
    let blog = this.props.blogById
    let data = {
      id: blog._id,
      blogCode: blog.blogCode,
      title: blog.title,
      slug: slug(blog.title, { lower: true }),
      description: blog.description,
      companyCode: blog.companyCode,
      language: blog.language,
      project: blog.project,
      feature: blog.feature,
      content: blog.content,
      image: this.props.blogImage,
      category: blog.category,
      date_post: blog.date_post,
      writtenBy: `${cookies.get("user").firstName} ${
        cookies.get("user").lastName
      }`,
    }
    await this.props.updateBlog(data)
  }
  render() {
    if (this.props.success === true) {
      Swal.fire({
        title: "Saved!",
        text: "Your blog is saved",
        type: "success",
        confirmButtonText: "Ok",
        onClose: () => {
          this.props.setBlogState({ success: false })
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

    let blog = this.props.blogById
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
            <div className="card-body ">
              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Title</label>
                <input
                  type="text"
                  onChange={this.handleInputChange}
                  name="title"
                  class="form-control"
                  value={blog.title}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Description</label>
                <input
                  name="description"
                  type="text"
                  onChange={this.handleInputChange}
                  class="form-control"
                  value={blog.description}
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
                  value={blog.companyCode}
                />
              </div>
              <div class="col-md-12  form-group mb-3">
                <label className="input-label">Language</label>
                <input
                  type="text"
                  onChange={this.handleInputChange}
                  name="language"
                  class="form-control"
                  value={blog.language}
                />
              </div>

              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Project</label>
                <input
                  type="text"
                  onChange={this.handleInputChange}
                  name="project"
                  class="form-control"
                  value={blog.project}
                />
              </div>
              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Feature</label>
                <select
                  type="text"
                  onChange={this.handleInputChange}
                  name="feature"
                  class="form-control"
                >
                  <option selected={blog.feature === true} value={true}>
                    True
                  </option>
                  <option selected={blog.feature === false} value={false}>
                    False
                  </option>
                </select>
              </div>
              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Category</label>
                <select
                  type="text"
                  onChange={this.handleInputChange}
                  name="category"
                  class="form-control"
                >
                  <option value={""}>Category</option>
                  {this.props.blogCategories.map(category => {
                    return (
                      <option
                        selected={blog.category === category.name}
                        value={category.name}
                      >
                        {category.name}
                      </option>
                    )
                  })}
                </select>
              </div>

              <div class="col-md-12 form-group mb-3">
                <label className="input-label">Content</label>
                <Editor
                  apiKey={EDITOR_API}
                  value={blog.content}
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
                  <ImageItem url={this.props.blogImage} type={"blog"} />
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
                    inputVariant="standard"
                    disabled={!this.state.schedule}
                    value={blog.date_post}
                    onChange={this.handleDateChange}
                  />
                </MuiPickersUtilsProvider>
              </div>
              <Button
                onClick={this.handleSave}
                variant="contained"
                color="primary"
              >
                Save
              </Button>
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
  loading: state.dialog.loading,
  blogCategories: state.blogCategories.blogCategories,
  blogById: state.blogs.blogById,
  success: state.blogs.success,
  error: state.blogs.error,
  query: state.blogs.query,
})
const mapDispatch = dispatch => ({
  selectMenu: dispatch.menu.setState,
  loadBlogById: dispatch.blogs.loadBlogById,
  uploadBlogContentImages: dispatch.upload.uploadBlogContentImages,
  setBlogById: dispatch.blogs.setBlogById,
  loadAllCategories: dispatch.blogCategories.loadAllCategories,
  updateBlog: dispatch.blogs.updateBlog,
  setBlogState: dispatch.blogs.setState,
})
export default connect(mapState, mapDispatch)(EditBlog)
