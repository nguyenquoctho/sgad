import React from "react"
import { Link } from "gatsby"
import Layout from "../../../components/layout"
import SEO from "../../../components/seo"
import { connect } from "react-redux"
import * as moment from "moment"
class BlogPage extends React.Component {
  constructor(props) {
    super(props)
    this.delete = this.delete.bind(this)
    this.changePage = this.changePage.bind(this)
    this.search = this.search.bind(this)
    this.showAll = this.showAll.bind(this)
  }
  async componentWillMount() {
    let page = await new URL(window.location.href).searchParams.get("page")
    if (page) {
      await this.props.setQuery({ page: parseInt(page) })
    }
    // Select menu
    this.props.selectMenu({ index: 5 })
    await this.props.loadBlogByQuery(this.props.query)
  }
  async delete(id, image) {
    let data = {
      imageUrl: image,
      type: "blog",
    }
    if (image) {
      await this.props.deleteImage(data)
    }
    await this.props.deleteBlog({ id: id })
    await this.props.loadBlogByQuery(this.props.query)
    await this.props.loadBlogByQueryNoLimit(this.props.query)
  }
  async search(event) {
    if (event.keyCode === 13) {
      await this.props.setQuery({ search: event.target.value })
      await this.props.loadBlogByQuery(this.props.query)
      await this.props.loadBlogByQueryNoLimit(this.props.query)
    }
  }
  async changePage(item) {
    await this.props.setQuery({ page: item })
    await this.props.loadBlogByQuery(this.props.query)
    await window.history.pushState({}, "", `?page=${this.props.query.page}`)
  }
  async showAll() {
    await this.props.clearQuery()
    await this.props.loadBlogByQuery(this.props.query)
  }

  render() {
    let numberOfPage = []
    for (
      var i = 0;
      i < Math.ceil(this.props.numberOfBlogs / this.props.query.pageSize);
      i++
    ) {
      numberOfPage.push(i)
    }
    let pagination = numberOfPage.map(item => {
      let active
      if (item + 1 === this.props.query.page) {
        active = "active"
      } else {
        active = ""
      }
      return (
        <>
          <li class={"page-item " + active}>
            <a class="page-link" onClick={() => this.changePage(item + 1)}>
              {item + 1}
            </a>
          </li>
        </>
      )
    })
    let listBlogs = this.props.blogsByQuery.map((blog, index) => {
      return (
        <>
          <tr>
            <td>
              {(this.props.query.page - 1) * this.props.query.pageSize +
                index +
                1}
            </td>
            <td>{blog.title}</td>
            <td>{blog.category}</td>
            <td>
              <img
                style={{ height: "120px", width: "120px" }}
                src={blog.image}
              />
            </td>
            <td>{blog.writtenBy}</td>
            <td>{moment(blog.date_post).format("h:mm A, DD/MM/YYYY")}</td>
            <td>
              <div class="d-flex">
                <Link
                  to={`/company/blog/edit?id=${blog._id}`}
                  type="button"
                  class="action-btn btn btn-outline-primary btn-sm custom m-1"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  class="action-btn btn btn-outline-danger btn-sm custom m-1"
                  onClick={() => this.delete(blog._id, blog.image)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </>
      )
    })
    return (
      <Layout currentPage="blog" role="company">
        <SEO title="Blogs" />
        <div
          class={
            "main-content-wrap d-flex flex-column " + this.props.contentStatus
          }
        >
          <div class="breadcrumb d-flex justify-content-between">
            <h1>Blogs</h1>
            <Link
              to="/company/blog/add"
              type="button"
              class="btn btn-outline-primary m-1"
            >
              New
            </Link>
          </div>
          <div class="separator-breadcrumb border-top"></div>
          <div className="flex-grow-1">
            <div class="card text-left">
              <div className="card-body">
                <div class="table-responsive">
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      onClick={this.showAll}
                      className="btn btn-raised btn-raised-primary btn-sm btn-rounded m-1"
                    >
                      Show all
                    </button>
                    <div>
                      <label>
                        Search:
                        <input
                          name="search"
                          class="form-control form-control-sm"
                          onKeyDown={this.search}
                          aria-controls="zero_configuration_table"
                        />
                      </label>
                    </div>
                  </div>
                  <table
                    id="zero_configuration_table"
                    class="display table table-striped table-bordered"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Image</th>
                        <th>Editor</th>
                        <th>Date post</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>{listBlogs}</tbody>
                  </table>
                  <div class="col-md-12 mt-5 text-center">
                    <ul class="pagination d-inline-flex">{pagination}</ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
const mapState = state => ({
  projectsState: state.projects.projects,
  contentStatus: state.menu.contentStatus,
  blogs: state.blogs.blogs,
  blogsByQuery: state.blogs.blogsByQuery,
  query: state.blogs.query,
  numberOfBlogs: state.blogs.numberOfBlogs,
  loading: state.dialog.loading,
})
const mapDispatch = dispatch => ({
  loadProject: dispatch.projects.loadProject,
  selectMenu: dispatch.menu.setState,
  loadAllBlogs: dispatch.blogs.loadAllBlogs,
  deleteBlog: dispatch.blogs.deleteBlog,
  loadBlogByQuery: dispatch.blogs.loadBlogByQuery,
  setQuery: dispatch.blogs.setQuery,
  clearQuery: dispatch.blogs.clearQuery,
  loadBlogByQueryNoLimit: dispatch.blogs.loadBlogByQueryNoLimit,
  updateBlog: dispatch.blogs.updateBlog,
  deleteImage: dispatch.upload.deleteImage,
})
export default connect(mapState, mapDispatch)(BlogPage)
