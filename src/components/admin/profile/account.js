import React from "react"
export default class AccountProfile extends React.Component {
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
          <h4>Account Information</h4>
          <hr />
          <form>
            <div class="form-group row">
              <label for="inputEmail3" class="col-sm-2 col-form-label">
                Old Password
              </label>
              <div class="col-sm-10">
                <input
                  type="password"
                  class="form-control"
                  disabled=""
                  name="old"
                  placeholder="Old Password"
                  value=""
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="inputEmail3" class="col-sm-2 col-form-label">
                New Password
              </label>
              <div class="col-sm-10">
                <input
                  type="password"
                  class="form-control"
                  disabled=""
                  name="new"
                  placeholder="New Password"
                  value=""
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="inputPassword3" class="col-sm-2 col-form-label">
                Confirm Password
              </label>
              <div class="col-sm-10">
                <input
                  type="password"
                  class="form-control"
                  disabled=""
                  name="confirm"
                  placeholder="Confirm Password"
                  value=""
                />
              </div>
            </div>
            <div class="form-group row">
              <div class="col-sm-12 d-flex justify-content-end">
                <button type="submit" class="btn btn-primary">
                  Edit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
