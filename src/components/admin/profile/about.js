import React from "react"
export default class AboutProfile extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div class="tab-content" id="profileTabContent">
        <div
          class="tab-pane fade active show"
          id="timeline"
          role="tabpanel"
          aria-labelledby="timeline-tab"
        >
          <h4>Personal Information</h4>
          <hr></hr>
          <div class="row">
            <div class="col-md-4 col-6">
              <div class="mb-4">
                <p class="text-primary mb-1">
                  <i class="i-Calendar text-16 mr-1"></i> Name
                </p>
                <input
                  type="text"
                  class="form-control"
                  name="name"
                  placeholder={this.props.name}
                  // value="Thong Nguyen"
                />
              </div>
            </div>
            <div class="col-md-4 col-6">
              <div class="mb-4">
                <p class="text-primary mb-1">
                  <i class="i-Calendar text-16 mr-1"></i> Email
                </p>
                <input
                  type="text"
                  class="form-control"
                  name="email"
                  placeholder={this.props.email}
                  // value="playerthong@gmail.com"
                />
              </div>
            </div>
            <div class="col-md-4 col-6">
              <div class="mb-4">
                <p class="text-primary mb-1">
                  <i class="i-MaleFemale text-16 mr-1"></i> Gender
                </p>
                <select class="form-control" name="gender">
                  <option value={this.props.gender}>{this.props.gender}</option>
                  <option value={this.props.gender==="Male"?"Female":"Male"}>{this.props.gender==="Male"?"Female":"Male"}</option>
                </select>
              </div>
            </div>
            <div class="col-md-12 col-12 d-flex justify-content-end">
              <div class="mb-4">
                <button type="submit" class="btn btn-primary">
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
