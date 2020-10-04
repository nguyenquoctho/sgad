import React from "react"
import { Link } from "gatsby"
import "./style.css"
import Layout from "../../../components/layout"
import SEO from "../../../components/seo"
import { limitPerRequest, BASE_URL } from "../../../setting"
import Swal from "sweetalert2"
import { connect } from "react-redux"
import { Cookies } from "react-cookie"
const cookies = new Cookies()
let companyCode
if (cookies.get("user")) {
  companyCode = {
    companyCode: cookies.get("user").companyCode,
  }
}

class ProjectPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { projects: [], activeLoading: false, data: {} }
    this.deleteProject = this.deleteProject.bind(this)
    this.fetchProject = this.fetchProject.bind(this)
    this.showAll = this.showAll.bind(this)
    this.search = this.search.bind(this)
    this.changePage = this.changePage.bind(this)
  }
  setData(data) {
    this.setState({ data: data })
  }
  async deleteProject(id, company, code, imageUrl) {
    await this.setState({ activeLoading: true })
    let data = {
      imageUrl: imageUrl,
      type: "project",
    }
    await this.props.deleteProject(id)
    await this.props.deleteImage(data)
    await this.setState({ activeLoading: false })
    await this.props.updateTotalProject({
      id: this.props.settings._id,
      totalProject: parseInt(this.props.settings.totalProject) - 1,
    })
    this.fetchProject()
  }
  fetchProject() {
    this.props.loadProject(companyCode)
  }
  async changePage(item) {
    await this.props.setQuery({ page: item })
    await window.history.pushState({}, "", `?page=${this.props.query.page}`)
    await this.props.loadProjectByQuery(this.props.query)
  }
  async showAll() {
    await this.props.clearQuery()
    await this.props.loadProjectByQuery(this.props.query)
    await this.props.loadProjectByQueryNoLimit(this.props.query)
  }
  async search(event) {
    if (event.keyCode == 13) {
      await this.props.setQuery({ search: event.target.value })
      await this.props.loadProjectByQuery(this.props.query)
      await this.props.loadProjectByQueryNoLimit(this.props.query)
    }
  }
  async componentDidMount() {
    let page = await new URL(window.location.href).searchParams.get("page")
    if (page) {
      await this.props.setQuery({ page: page })
    }
    this.props.selectMenu({ index: 1 })
    await this.props.loadProjectByQuery(this.props.query)
    await this.props.loadProjectByQueryNoLimit(this.props.query)
    await this.props.loadSettings(companyCode)
  }
  render() {
    if (this.props.success == true) {
      Swal.fire({
        title: "Success!",
        text: "",
        type: "success",
        confirmButtonText: "Ok",
        onClose: async () => {
          await this.props.setProjectState({ success: false })
          await window.location.replace(BASE_URL + "/company/project")
        },
      })
    }
    let numberOfPage = []
    for (
      var i = 0;
      i < Math.ceil(this.props.numberOfProjects / limitPerRequest);
      i++
    ) {
      numberOfPage.push(i)
    }
    let pagination = numberOfPage.map(item => {
      let active
      if (item == this.props.query.page) {
        active = "active"
      } else {
        active = ""
      }
      return (
        <>
          <li class={"page-item " + active}>
            <a class="page-link" onClick={() => this.changePage(item)}>
              {item + 1}
            </a>
          </li>
        </>
      )
    })
    let listProject = this.props.projectsByQuery.map((project, index) => {
      return (
        <>
          <tr>
            <td>{this.props.query.page * 10 + index + 1}</td>
            <td>{project.projectCode}</td>
            <td>{project.name}</td>
            <td>{"Dist. " + project.district}</td>
            <td>
              <div class="d-flex">
                <Link
                  to={`/company/project/edit?id=${project._id}`}
                  type="button"
                  class="action-btn btn btn-outline-primary btn-sm custom m-1"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  class="action-btn btn btn-outline-danger btn-sm custom m-1"
                  onClick={() =>
                    this.deleteProject(
                      project._id,
                      project.companyCode,
                      project.projectCode,
                      project.image
                    )
                  }
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
      <Layout role="company">
        <SEO title="Project" />
        <div
          class={
            "main-content-wrap d-flex flex-column " + this.props.contentStatus
          }
        >
          <div class="breadcrumb d-flex justify-content-between">
            <h1>Projects</h1>
            <Link
              to="/company/project/add"
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
                        <th>Number</th>
                        <th>Project Code</th>
                        <th>Project Name</th>
                        <th>District</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>{listProject}</tbody>
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
  projects: state.projects.projects,
  projectById: state.projects.projectById,
  projectsByQuery: state.projects.projectsByQuery,
  numberOfProjects: state.projects.numberOfProjects,
  success: state.projects.success,
  error: state.projects.error,
  query: state.projects.query,
  loading: state.dialog.loading,
  contentStatus: state.menu.contentStatus,
  settings: state.settings.settings,
})
const mapDispatch = dispatch => ({
  loadProject: dispatch.projects.loadProject,
  loadProjectById: dispatch.projects.loadProjectById,
  deleteProject: dispatch.projects.deleteProject,
  clearQuery: dispatch.projects.clearQuery,
  setQuery: dispatch.projects.setQuery,
  loadProjectByQuery: dispatch.projects.loadProjectByQuery,
  loadProjectByQueryNoLimit: dispatch.projects.loadProjectByQueryNoLimit,
  setProjectState: dispatch.projects.setState,
  deleteImage: dispatch.upload.deleteImage,
  selectMenu: dispatch.menu.setState,
  updateTotalProject: dispatch.settings.updateTotalProject,
  loadSettings: dispatch.settings.loadSettings,
})
export default connect(
  mapState,
  mapDispatch
)(ProjectPage)
