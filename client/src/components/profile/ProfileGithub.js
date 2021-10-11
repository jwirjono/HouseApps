import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getGithubRepos } from '../../actions/profile'
import Spinner from '../layout/Spinner'

const ProfileGithub = ({ username, getGithubRepos, repos }) => {
    useEffect(() => {
        getGithubRepos(username);
    }, [getGithubRepos]);
    return (
        <div>
            <div className="profile-github">
                <h2 className="text-primary my-1">Github Repos</h2>
                {repos === null ? <Spinner /> : (
                    repos.map(rep => (
                        <div key={rep._id} className='repo bg-white p-1 my-1'>
                            <div>
                                <h4><a href={rep.html_url}>{rep.name}</a></h4>
                                <p>{rep.description}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

ProfileGithub.propTypes = {

}

const mapStateToProps = state => ({
    repos: state.profile.repos
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub)
