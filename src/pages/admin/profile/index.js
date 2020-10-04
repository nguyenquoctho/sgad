import React from "react"
import { Link } from "gatsby"

import Layout from "../../../components/layout"
import SEO from "../../../components/seo"
import AboutProfile from "../../../components/admin/profile/about"
import AccountProfile from "../../../components/admin/profile/account"
import "./style.css"
import { BASE_URL } from "../../../setting"
import { connect } from "react-redux"
import { Cookies } from "react-cookie"
const cookies = new Cookies()
 class ProfilePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { currentTab: "about", admin: {} }
    this.changeTab = this.changeTab.bind(this)
  }
  changeTab(tab) {
    this.setState({ currentTab: tab })
  }
  componentDidMount() {
    this.props.selectMenu({index:2})
    this.setState({ admin: cookies.get("admin") })
  }
  render() {
    let listTab
    let bodyTab
    if (this.state.currentTab === "about") {
      listTab = (
        <ul
          class="nav nav-tabs profile-nav mb-4"
          id="profileTab"
          role="tablist"
        >
          <li class="nav-item">
            <a
              class="nav-link active"
              id="about-tab"
              data-toggle="tab"
              role="tab"
              aria-controls="timeline"
              aria-selected="false"
              onClick={() => this.changeTab("about")}
            >
              About
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              id="account-tab"
              data-toggle="tab"
              role="tab"
              aria-controls="about"
              aria-selected="true"
              onClick={() => this.changeTab("account")}
            >
              Account
            </a>
          </li>
        </ul>
      )
      bodyTab = (
        <AboutProfile
          name={this.state.admin.fullname}
          email={this.state.admin.email}
          gender={this.state.admin.gender}
        />
      )
    } else if (this.state.currentTab === "account") {
      listTab = (
        <ul
          class="nav nav-tabs profile-nav mb-4"
          id="profileTab"
          role="tablist"
        >
          <li class="nav-item">
            <a
              class="nav-link "
              id="about-tab"
              data-toggle="tab"
              role="tab"
              aria-controls="timeline"
              aria-selected="false"
              onClick={() => this.changeTab("about")}
            >
              About
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link active"
              id="account-tab"
              data-toggle="tab"
              role="tab"
              aria-controls="about"
              aria-selected="true"
              onClick={() => this.changeTab("account")}
            >
              Account
            </a>
          </li>
        </ul>
      )
      bodyTab = <AccountProfile />
    }


    return (
      <Layout currentPage="profile" role="admin">
        <SEO title="Profile" />
        <div class={"main-content-wrap d-flex flex-column "+this.props.contentStatus}>
          <div class="breadcrumb">
            <h1>Profile</h1>
          </div>
          <div class="separator-breadcrumb border-top"></div>
          <div class="card user-profile o-hidden mb-4">
            <div
              class="header-cover"
              style={{
                backgroundImage: ` url('${BASE_URL}/images/login-background.jpg')`,
              }}
            ></div>
            <div class="user-info">
              <img
                class="profile-picture avatar-lg mb-2"
                src={BASE_URL + "/images/face.jpg"}
                alt=""
              />
              <p class="m-0 text-24">{this.state.admin.fullname}</p>
              <p class="text-muted m-0">Digital Marketer</p>
            </div>
            <div class="card-body">
              {listTab}
              {bodyTab}
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
const mapState = state => ({
  contentStatus:state.menu.contentStatus
})
const mapDispatch = dispatch => ({
  selectMenu:dispatch.menu.setState
})
export default connect(
  mapState,
  mapDispatch
)(ProfilePage)