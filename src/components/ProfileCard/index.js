import {Link} from 'react-router-dom'
import {Component} from 'react'

import {BsSearch, BsFillPersonFill} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const apiProfileStatusConstant = {
  initial: 'INITIAL',
  success: 'PROFILE_SUCCESS',
  failure: 'PROFILE_FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProfileCard extends Component {
  state = {
    apiProfileStatus: apiProfileStatusConstant.initial,
    profileData: {},
  }

  componentDidMount() {
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    this.setState({
      apiProfileStatus: apiProfileStatusConstant.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/profile`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedProfileData = await response.json()
      console.log(fetchedProfileData)
      const updatedProfileData = {
        name: fetchedProfileData.profile_details.name,
        profileImageUrl: fetchedProfileData.profile_details.profile_image_url,
        shortBio: fetchedProfileData.profile_details.short_bio,
      }

      console.log(updatedProfileData)

      this.setState({
        apiProfileStatus: apiProfileStatusConstant.success,
        profileData: updatedProfileData,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiProfileStatus: apiProfileStatusConstant.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProfileSuccessView = () => {
    const {apiProfileStatus, profileData} = this.state
    return (
      <div className="profile-container">
        <img
          src={profileData.profileImageUrl}
          alt="profile"
          className="profile-icon"
        />
        <h1 className="profile-heading">{profileData.name}</h1>
        <p className="profile-details">{profileData.shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => {
    const {apiProfileStatus, profileData} = this.state

    return (
      <div className="profile-failure-container">
        <button
          type="button"
          className="retry-btn-style"
          onClick={this.getProfileDetails}
        >
          Retry
        </button>
      </div>
    )
  }

  renderProfileDetails = () => {
    const {apiProfileStatus} = this.state
    console.log(apiProfileStatus)
    switch (apiProfileStatus) {
      case apiProfileStatusConstant.success:
        return this.renderProfileSuccessView()
      case apiProfileStatusConstant.failure:
        return this.renderProfileFailureView()
      case apiProfileStatusConstant.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {apiProfileStatus, profileData} = this.state

    return <>{this.renderProfileDetails()}</>
  }
}

export default ProfileCard
