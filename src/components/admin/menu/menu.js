import React from "react"
export default class Menu extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div class="side-content-wrap">
        <div
          class="sidebar-left open rtl-ps-none"
          data-perfect-scrollbar
          data-suppress-scroll-x="true"
        >
          <ul class="navigation-left">
            <li class="nav-item" data-item="dashboard">
              <a class="nav-item-hold" href="#">
                <i class="nav-icon i-Bar-Chart"></i>
                <span class="nav-text">Dashboard</span>
              </a>
              <div class="triangle"></div>
            </li>
            <li class="nav-item" data-item="uikits">
              <a class="nav-item-hold" href="#">
                <i class="nav-icon i-Building"></i>
                <span class="nav-text">Company</span>
              </a>
              <div class="triangle"></div>
            </li>
            <li class="nav-item" data-item="extrakits">
              <a class="nav-item-hold" href="#">
                <i class="nav-icon i-Administrator"></i>
                <span class="nav-text">Profile</span>
              </a>
              <div class="triangle"></div>
            </li>   
          </ul>
        </div>
      </div>
    )
  }
}
