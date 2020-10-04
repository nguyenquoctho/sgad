import React from 'react'
import CircularProgress from "@material-ui/core/CircularProgress";
import "./style.css"
export default class LoadingContainer extends React.Component {
    render() {

        return (
            <div className={`overlay rounded  ${this.props.isOpen ? "show" : ""}`}>
                <CircularProgress color="secondary" />
            </div>
        )
    }
}