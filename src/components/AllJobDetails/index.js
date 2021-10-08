import {Link} from 'react-router-dom'
import {Component} from 'react'
import {FcRating} from 'react-icons/fc'
import {GoLocation} from 'react-icons/go'
import {FaSuitcase} from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiJobStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
class AllJobDetails extends Component {
  state = {
    jobsList: [],
    apiJobStatus: apiJobStatusConstants.initial,
    activeEmploymentType: '',
    activeSalaryRange: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    const {
      apiStatus,
      jobsList,
      searchInput,
      activeEmploymentType,
      activeSalaryRange,
    } = this.state
    this.setState({
      apiJobStatus: apiJobStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentType}&minimum_package=${activeSalaryRange}&search=${searchInput}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiJobStatus: apiJobStatusConstants.success,
      })
    } else {
      this.setState({
        apiJobStatus: apiJobStatusConstants.failure,
      })
    }
  }

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="jobs failure"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-btn-style" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderJobsListView = () => {
    const {jobsList} = this.state
    const shouldShowJobsList = jobsList.length > 0

    return shouldShowJobsList ? (
      <div className="all-jobs-container">
        <ul className="jobs-list">
          {jobsList.map(eachJob => (
            <Link to={`/jobs/${eachJob.id}`} className="link-item">
              <li className="job-item">
                <div className="logo-card">
                  <img
                    src={eachJob.companyLogoUrl}
                    alt="company logo"
                    className="company-logo-style"
                  />
                  <div className="titiles">
                    <h1 className="hdng">{eachJob.title}</h1>
                    <div className="rating-container">
                      <FcRating className="star" />

                      <p className="rating">{eachJob.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="location-container">
                  <div className="card">
                    <button className="location-btn">
                      <GoLocation className="icon-style" />
                    </button>
                    <p className="msg">{eachJob.location}</p>

                    <button className="location-btn">
                      <FaSuitcase className="icon-style" />
                    </button>
                    <p className="msg">{eachJob.employmentType}</p>
                  </div>
                  <p className="hdng pkg">{eachJob.packagePerAnnum}</p>
                </div>
                <hr className="ruler" />
                <h1 className="hdng">Description</h1>
                <p className="msg">{eachJob.jobDescription}</p>
              </li>
            </Link>
          ))}
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-products-img"
          alt="no products"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllJobs = () => {
    const {apiJobStatus} = this.state

    switch (apiJobStatus) {
      case apiJobStatusConstants.success:
        return this.renderJobsListView()
      case apiJobStatusConstants.failure:
        return this.renderFailureView()
      case apiJobStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {
      jobsList,
      apiJobStatus,
      searchInput,
      activeEmploymentType,
      activeSalaryRange,
    } = this.state
    return <div className="all-Jobs-section">{this.renderAllJobs()}</div>
  }
}

export default AllJobDetails
