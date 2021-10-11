import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner'
import { connect } from 'react-redux'
import { getProfiles } from '../../actions/profile'
import ListProfileItem from './ListProfileItem'

const ListProfile = ({ getProfiles, profile: { profiles, loading } }) => {
    useEffect(() => {
        getProfiles();
    }, [getProfiles]);

    return <Fragment>
        {loading ? <Spinner /> :
            <Fragment>
                <h1 className="large text-primary">Developers</h1>
                <p className="lead">
                    <i className="fab fa-connectdevelop"></i> Browse and Connect with developers
                </p>
                <div className="profiles">
                    {profiles.length > 0 ? (
                        profiles.map(a => (
                            <ListProfileItem key={a._id} profile={a} />
                        ))
                    ) : (<h4>No Profiles found..</h4>)
                    }
                </div>
            </Fragment>
        }
    </Fragment>
}

ListProfile.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, { getProfiles })(ListProfile)
