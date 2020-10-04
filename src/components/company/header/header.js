import { Link } from "gatsby"
import React from "react"
import { BASE_URL } from "../../../setting"
import { Cookies } from "react-cookie"
import { connect } from "react-redux"
import "./style.css"
const cookies = new Cookies()
class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userShow: "",
      currentPage: "",
      user: {},
      selectedIndex: 0,
    }
    this.handleUser = this.handleUser.bind(this)
    this.handleActivePage = this.handleActivePage.bind(this)
    this.logOut = this.logOut.bind(this)
    this.setSideBarStatus = this.setSideBarStatus.bind(this)
    this.reSizeBar = this.reSizeBar.bind(this)
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
    cookies.remove("user", { path: "/" })
    window.location.replace(BASE_URL + "/company/login")
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
  reSizeBar() {
    let width = window.innerWidth
    if (width < 992) {
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
    this.setState({ user: cookies.get("user") })
    window.addEventListener("resize", this.reSizeBar)
  }
  render() {
    let menu = [
      {
        title: "Dashboard",
        link: "/company/dashboard",
        icon: "i-Bar-Chart",
      },
      {
        title: "Projects",
        link: "/company/project",
        icon: "i-Map",
      },
      {
        title: "Houses",
        link: "/company/house",
        icon: "i-Building",
      },
      {
        title: "Setting",
        link: "/company/setting",
        icon: "i-Gear",
      },
      // {
      //   title: "Customers",
      //   link: "/company/customers",
      //   icon: "i-Administrator",
      // },
      {
        title: "Blogs",
        link: "/company/blog",
        icon: "i-Newspaper",
      },
      {
        title: "Blog Categories",
        link: "/company/blog/categories",
        icon: "i-Newspaper-2",
      },
    ]
    return (
      <div class="app-admin-wrap layout-sidebar-large clearfix">
        <div class="main-header">
          <div class="logo">
            <img src={BASE_URL + "/images/logo.png"} alt="" />
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
                  src={BASE_URL + "/images/face.jpg"}
                />
                <div
                  className={
                    "dropdown-menu dropdown-menu-right " + this.state.userShow
                  }
                >
                  <div class="dropdown-header">
                    <i class="i-Lock-User mr-1"></i>{" "}
                    {this.state.user.firstName + " " + this.state.user.lastName}
                  </div>
                  <Link>
                    <a class="dropdown-item">Account settings</a>
                  </Link>

                  <button onClick={this.logOut} class="dropdown-item">
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="side-content-wrap">
          <div
            class={"sidebar-left rtl-ps-none " + this.props.sideBarStatus}
            data-perfect-scrollbar={true}
            data-suppress-scroll-x={true}
            style={{ overflowY: "scroll" }}
          >
            <div>
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
export default connect(mapState, mapDispatch)(Header)
