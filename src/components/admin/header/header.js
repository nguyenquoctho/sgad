import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"
import { BASE_URL } from "../../../setting"
import { Cookies } from "react-cookie"
const cookies = new Cookies()
class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = { userShow: "", currentPage: "", admin: {} }
    this.handleUser = this.handleUser.bind(this)
    this.handleActivePage = this.handleActivePage.bind(this)
    this.logOut = this.logOut.bind(this)
    this.setSideBarStatus = this.setSideBarStatus.bind(this)
  }

  handleActivePage(page) {
    this.setState({ currentPage: page })
  }
  handleUser() {
    if (this.state.userShow === "") {
      this.setState({ userShow: "show" })
    } else {
      this.setState({ userShow: "" })
    }
  }
  logOut() {
    cookies.remove("token", { path: "/" })
    cookies.remove("admin", { path: "/" })
    window.location.replace(BASE_URL + "/admin/login")
  }
  setSideBarStatus() {
    if (
      this.props.sideBarStatus === "open" &&
      this.props.contentStatus === "sidenav-open"
    ) {
      this.props.setSideBarStatus({ sideBarStatus: "", contentStatus: "" })
    } else {
      this.props.setSideBarStatus({
        sideBarStatus: "open",
        contentStatus: "sidenav-open",
      })
    }
  }
  componentDidMount() {
    if (!cookies.get("token")) {
      window.location.replace(BASE_URL + "/admin/login")
    }
    this.setState({ admin: cookies.get("admin") })
  }
  render() {
    let menu = [
      {
        title: "Dashboard",
        link: "/admin/dashboard",
        icon: "i-Bar-Chart",
      },
      {
        title: "Company",
        link: "/admin/company",
        icon: "i-Building ",
      },
      {
        title: "Profile",
        link: "/admin/profile",
        icon: "i-Administrator",
      },
    ]
    return (
      <div class="app-admin-wrap layout-sidebar-large clearfix">
        <div class="main-header">
          <div class="logo">
            <img src="../../images/logo.png" alt="" />
          </div>
          <div class="menu-toggle" onClick={this.setSideBarStatus}>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div style={{ margin: "auto" }}></div>
          <div className="header-part-right">
            <div className="dropdown">
              <div className="user col align-self-end">
                <img
                  onClick={this.handleUser}
                  className="user-avatar"
                  src="../../images/face.jpg"
                />
                <div
                  className={
                    "dropdown-menu dropdown-menu-right " + this.state.userShow
                  }
                >
                  <div class="dropdown-header">
                    <i class="i-Lock-User mr-1"></i> {this.state.admin.fullname}
                  </div>
                  <Link to="/admin/profile">
                    <a class="dropdown-item">Account settings</a>
                  </Link>

                  <a class="dropdown-item" onClick={this.logOut}>
                    Sign out
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="side-content-wrap">
          <div
            class={"sidebar-left rtl-ps-none " + this.props.sideBarStatus}
            data-perfect-scrollbar
            data-suppress-scroll-x="true"
          >
            <ul class="navigation-left">
              {menu.map((item, index) => {
                let active
                if (index === this.props.selectedIndex) {
                  active = "active"
                } else {
                  active = ""
                }
                return (
                  <li
                    className={"nav-item page-item " + active}
                    id="dashboard"
                    data-item="dashboard"
                  >
                    <Link to={item.link}>
                      <div class="nav-item-hold ">
                        <i class={"nav-icon " + item.icon}></i>
                        <span class="nav-text d-flex justify-content-center">
                          {item.title}
                        </span>
                      </div>
                      <div class="triangle"></div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
const mapState = state => ({
  selectedIndex: state.menu.index,
  sideBarStatus: state.menu.sideBarStatus,
  contentStatus: state.menu.contentStatus,
})
const mapDispatch = dispatch => ({
  setSideBarStatus: dispatch.menu.setState,
})
export default connect(
  mapState,
  mapDispatch
)(Header)
