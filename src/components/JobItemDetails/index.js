import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {RiExternalLinkLine} from 'react-icons/ri'
import {GoLocation} from 'react-icons/go'
import {FaSuitcase} from 'react-icons/fa'
import {FcRating} from 'react-icons/fc'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstant.initial,
    jobDetails: {},
    similarJobDetails: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  formatFetchedData = data => ({
    id: data.id,
    title: data.title,
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    jobDescription: data.job_description,
    lifeAtCompany: data.life_at_company,

    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    skills: data.skills,
  })

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({
      apiStatus: apiStatusConstant.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)

      const updatedJobDetails = this.formatFetchedData(fetchedData.job_details)

      console.log(updatedJobDetails)

      const updatedSimilarJobDetails = fetchedData.similar_jobs.map(
        eachSimilarJob => this.formatFetchedData(eachSimilarJob),
      )
      console.log(updatedSimilarJobDetails)

      this.setState({
        jobDetails: updatedJobDetails,
        similarJobDetails: updatedSimilarJobDetails,
        apiStatus: apiStatusConstant.success,
      })
    }

    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstant.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Oops! Something Went Wrong</h1>
      <p className="error-msg">
        We cannot seem to find the page you are looking for
      </p>
      <Link to="/jobs/:id">
        <button type="button" className="button">
          Retry
        </button>
      </Link>
    </div>
  )

  renderSuccessView = () => {
    const {apiStatus, jobDetails, similarJobDetails} = this.state

    return (
      <div className="success-vw-container">
        <div className="job-item-details">
          <div className="logo-card">
            <img
              src={jobDetails.companyLogoUrl}
              alt="job details company logo"
              className="company-logo-style"
            />
            <div className="titiles">
              <h1 className="hdng">{jobDetails.title}</h1>
              <div className="rating-container">
                <FcRating className="star" />

                <p className="rating">{jobDetails.rating}</p>
              </div>
            </div>
          </div>
          <div className="location-container">
            <div className="card">
              <button className="location-btn">
                <GoLocation className="icon-style" />
              </button>
              <p className="msg">{jobDetails.location}</p>

              <button className="location-btn">
                <FaSuitcase className="icon-style" />
              </button>
              <p className="msg">{jobDetails.employmentType}</p>
            </div>
            <p className="hdng pkg">{jobDetails.packagePerAnnum}</p>
          </div>
          <hr className="ruler" />
          <div className="hdng-lnk-container">
            <h1 className="hdng">Description</h1>
            <a
              href={jobDetails.companyWebsiteUrl}
              className="hdng"
              alt="website logo"
            >
              Visit
            </a>
          </div>
          <p className="description-msg1">{jobDetails.jobDescription}</p>
          <p className="hdng">Skills</p>
          <ul className="skills-container">
            {jobDetails.skills.map(each => (
              <li className="skillitem">
                <img
                  src={each.image_url}
                  alt={each.name}
                  className="skill-image"
                  key={each.id}
                />
                <p className="msg-skill"> {each.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="hdng">Life at Company</h1>
          <div className="life-at-style">
            <p className="description-msg">
              {jobDetails.lifeAtCompany.description}
            </p>
            <img
              src={jobDetails.lifeAtCompany.image_url}
              alt=" life at company"
              className="life-company-image"
            />
          </div>
        </div>
        <div>
          <h1 className="hdng">Similar Jobs</h1>
          <ul className="similar-job-item-details">
            {similarJobDetails.map(eachSimilarJob => (
              <SimilarJobs
                similarJobDetails={eachSimilarJob}
                key={eachSimilarJob.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)
    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderSuccessView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      case apiStatusConstant.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.renderJobDetails()}
        </div>
      </>
    )
  }
}
export default JobItemDetails
