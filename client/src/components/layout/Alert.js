import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'


//alerts connected with mapStateToProps
const Alert = ({ alerts }) =>
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map(alt => (
        <div key={alt.id} className={`alert alert-${alt.alertType}`}>
            {alt.msg}
        </div>
    ))





Alert.propTypes = {
    alerts: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
    //state.alert from reducers/index.js
    alerts: state.alert
});

export default connect(mapStateToProps)(Alert);