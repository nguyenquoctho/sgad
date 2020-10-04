import React from "react"
import { Link } from "gatsby"
import "./style.css"
import Layout from "../../../components/layout"
import SEO from "../../../components/seo"
import { connect } from "react-redux"
class IndexPage extends React.Component {
  constructor(props) {
    super(props)
  }
  async componentWillMount() {
    // Select menu
    this.props.selectMenu({ index: 0 })
    await this.props.clearQuery()
    await this.props.loadProject(this.props.query)
    await this.props.loadHousesByQueryNoLimit()
    await this.props.loadHouses()
  }
  render() {
    let availableApartments = this.props.houses.filter(item => {
      return item.available === "Available"
    })
    return (
      <Layout currentPage="dashboard" role="company">
        <SEO title="Dashboard" />
        <div
          class={
            "main-content-wrap d-flex flex-column " + this.props.contentStatus
          }
        >
          <div class="breadcrumb d-flex justify-content-between">
            <h1>Dashboard</h1>
          </div>
          <div class="separator-breadcrumb border-top"></div>
          <div className="d-flex flex-wrap">
            <div class="col-lg-4 col-md-6 col-sm-6">
              <div class="card card-icon-bg  card-icon-bg-primary o-hidden mb-4">
                <div class="card-body text-center">
                  <i class="i-Building"></i>
                  <div class="content">
                    <p class="text-muted mt-2 mb-0">Apartments</p>
                    <p class="text-primary text-24 line-height-1 mb-2">
                      {this.props.numberOfHouses}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-6">
              <div class="card card-icon-bg  card-icon-bg-primary o-hidden mb-4">
                <div class="card-body text-center">
                  <i class="i-Green-House"></i>
                  <div class="content">
                    <p class="text-muted mt-2 mb-0">Available</p>
                    <p class="text-primary text-24 line-height-1 mb-2">
                      {availableApartments.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-6">
              <div class="card card-icon-bg  card-icon-bg-primary o-hidden mb-4">
                <div class="card-body text-center">
                  <i class="i-Newspaper-2"></i>
                  <div class="content">
                    <p class="text-muted mt-2 mb-0">Blogs</p>
                    <p class="text-primary text-24 line-height-1 mb-2">205</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-6">
              <div class="card card-icon-bg  card-icon-bg-primary o-hidden mb-4">
                <div class="card-body text-center">
                  <i class="i-Map"></i>
                  <div class="content">
                    <p class="text-muted mt-2 mb-0">Projects</p>
                    <p class="text-primary text-24 line-height-1 mb-2">
                      {this.props.projects.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-6">
              <div class="card card-icon-bg  card-icon-bg-primary o-hidden mb-4">
                <div class="card-body text-center">
                  <i class="i-Eye1"></i>
                  <div class="content">
                    <p class="text-muted mt-2 mb-0">Top View</p>
                    <p class="text-primary text-24 line-height-1 mb-2">205</p>
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
  projects: state.projects.projects,
  query: state.projects.query,
  numberOfHouses: state.houses.numberOfHouses,
  houses: state.houses.houses,
})
const mapDispatch = dispatch => ({
  loadProject: dispatch.projects.loadProject,
  selectMenu: dispatch.menu.setState,
  clearQuery: dispatch.projects.clearQuery,
  loadHousesByQueryNoLimit: dispatch.houses.loadHousesByQueryNoLimit,
  loadHouses: dispatch.houses.loadHouses,
})
export default connect(
  mapState,
  mapDispatch
)(IndexPage)
