import {Link} from 'react-router-dom'
import {Component} from 'react'

import {BsSearch, BsFillPersonFill} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {GoLocation} from 'react-icons/go'
import {FaSuitcase} from 'react-icons/fa'
import {FcRating} from 'react-icons/fc'
import Header from '../Header'
import AllJobDetails from '../AllJobDetails'
import ProfileCard from '../ProfileCard'
import './index.css'

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

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'JOBS_SUCCESS',
  failure: 'JOBS_FAILURE',
  nojobs: 'NO_JOBS',
  pffailure: 'PROFILE_FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstant.initial,
    jobsearchList: [],
    searchInput: '',
    activeEmploymentType: employmentTypesList[0].employmentTypeId,
    activeSalaryRange: salaryRangesList[0].salaryRangeId,
  }

  componentDidMount() {
    this.getJobSearchDetails()
  }

  formatFetchedData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  getJobSearchDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstant.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs`
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
      const updatedData = fetchedData.jobs.map(eachJob =>
        this.formatFetchedData(eachJob),
      )
      console.log(updatedData)

      this.setState({
        apiStatus: apiStatusConstant.success,
        jobsearchList: updatedData,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstant.failure,
      })
    }
  }

  getJobs = async () => {
    const {
      apiStatus,
      jobsearchList,
      searchInput,
      activeEmploymentType,
      activeSalaryRange,
    } = this.state
    this.setState({
      apiStatus: apiStatusConstant.inProgress,
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
        jobsearchList: updatedData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstant.failure,
      })
    }
  }

  changeSalaryRange = activeSalaryRange => {
    this.setState({activeSalaryRange}, this.getJobs)
  }

  changeEmploymentType = activeEmploymentType => {
    this.setState({activeEmploymentType}, this.getJobs)
  }

  enterSearchInput = () => {
    this.getJobs()
  }

  changeSearchInput = searchInput => {
    this.setState({searchInput})
  }

  onClickSalaryRange = event => {
    const {
      apiStatus,
      jobsearchList,
      activeEmploymentType,
      activeSalaryRange,
    } = this.state
    this.changeSalaryRange(event.target.value)
  }

  onChangeEmploymentType = event => {
    const {
      apiStatus,
      jobsearchList,
      activeEmploymentType,
      activeSalaryRange,
    } = this.state
    this.changeEmploymentType(event.target.value)
  }

  onEnterSearchInput = event => {
    const {
      apiStatus,
      jobsearchList,
      activeEmploymentType,
      activeSalaryRange,
    } = this.state
    if (event.key === 'Enter') {
      this.enterSearchInput()
    }
  }

  onChangeSearchInput = event => {
    const {
      apiStatus,
      jobsearchList,
      activeEmploymentType,
      activeSalaryRange,
    } = this.state
    this.changeSearchInput(event.target.value)
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

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

  renderNoJobsView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">No Jobs Found</h1>
      <p className="products-failure-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsListView = () => {
    const {jobsearchList} = this.state
    const shouldShowJobsList = jobsearchList.length > 0

    return shouldShowJobsList ? (
      <div className="all-products-container">
        <ul className="products-list">
          {jobsearchList.map(eachJob => (
            <li className="job-item">
              <Link to={`/jobs/${eachJob.id}`} className="link-item">
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
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-products-img"
          alt="no jobs"
        />
        <h1 className="no-products-heading">No Jobs Found</h1>
        <p className="no-products-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderSuccessView = () => {
    const {
      apiStatus,
      jobsearchList,
      activeEmploymentType,
      activeSalaryRange,
      searchInput,
    } = this.state

    return (
      <div className="success-container">
        <div className="sm-container">
          <div className="search-container">
            <input
              type="search"
              className="search-style"
              placeholder="Search"
              onChange={this.onChangeSearchInput}
              value={searchInput}
            />
            <button
              type="button"
              className="srch-btn-style"
              testid="searchButton"
              onClick={this.enterSearchInput}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <ProfileCard />
          <hr className="ruler" />
          <div className="filters-container">
            <ul className="types-container">
              <h1 className="filter-heading">Type Of Employment </h1>
              {employmentTypesList.map(each => {
                const isActive = each.employmentTypeId === activeEmploymentType
                const categoryClassName = isActive
                  ? `chkbx-style active-category-name`
                  : `chkbx-style`

                return (
                  <li className="filter-element">
                    <input
                      type="checkbox"
                      id="chkbx"
                      name="checkbox"
                      value={each.employmentTypeId}
                      className={categoryClassName}
                      onChange={this.onChangeEmploymentType}
                    />
                    <label htmlFor="checkbox" className="label-chkbx">
                      {each.label}
                    </label>
                  </li>
                )
              })}
            </ul>
            <hr className="ruler" />
            <ul className="types-container">
              <h1 className="filter-heading">Salary Range </h1>
              {salaryRangesList.map(each => {
                const isActive = each.salaryRangeId === activeSalaryRange
                const categoryClassName = isActive
                  ? `radiobtn-style active-category-name`
                  : `radiobtn-style`

                return (
                  <li className="filter-element">
                    <input
                      type="radio"
                      id="radioBtn"
                      name="radiobutn"
                      value={each.salaryRangeId}
                      className={categoryClassName}
                      onClick={this.onClickSalaryRange}
                    />
                    <label htmlFor="radiobutn" className="label-chkbx">
                      {each.label}
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
          <>{this.renderJobsListView()}</>
        </div>
        <div className="lg-container">
          <div className="filter-container">
            <ProfileCard />
            <hr className="ruler" />
            <div className="filters">
              <ul className="types-container">
                <h1 className="filter-heading">Type Of Employment </h1>
                {employmentTypesList.map(each => {
                  const isActive =
                    each.employmentTypeId === activeEmploymentType
                  const categoryClassName = isActive
                    ? `chkbx-style active-category-name`
                    : `chkbx-style`

                  return (
                    <li className="filter-element">
                      <input
                        type="checkbox"
                        id="chkbx"
                        name="checkbox"
                        value={each.employmentTypeId}
                        className={categoryClassName}
                        onChange={this.onChangeEmploymentType}
                      />
                      <label htmlFor="checkbox" className="label-chkbx">
                        {each.label}
                      </label>
                    </li>
                  )
                })}
              </ul>
              <hr className="ruler" />
              <ul className="types-container">
                <h1 className="filter-heading">Salary Range </h1>
                {salaryRangesList.map(each => {
                  const isActive = each.salaryRangeId === activeSalaryRange
                  const categoryClassName = isActive
                    ? `radiobtn-style active-category-name`
                    : `radiobtn-style`

                  return (
                    <li className="filter-element">
                      <input
                        type="radio"
                        id="radioBtn"
                        name="radiobutn"
                        value={each.salaryRangeId}
                        className={categoryClassName}
                        onClick={this.onClickSalaryRange}
                      />
                      <label htmlFor="radiobutn" className="label-chkbx">
                        {each.label}
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="job-srch-container">
            <div className="search-container">
              <input
                type="search"
                className="search-style"
                placeholder="Search"
                onChange={this.onChangeSearchInput}
                value={searchInput}
              />
              <button
                type="button"
                className="srch-btn-style"
                testid="searchButton"
                onClick={this.enterSearchInput}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <>{this.renderJobsListView()}</>
          </div>
        </div>
      </div>
    )
  }

  renderJobSearchDetails = () => {
    const {apiStatus, jobsearchList} = this.state

    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderSuccessView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      case apiStatusConstant.inProgress:
        return this.renderLoadingView()
      case apiStatusConstant.nojobs:
        return this.renderNoJobsView()
      default:
        return null
    }
  }

  render() {
    const {
      apiStatus,
      jobsearchList,
      searchInput,
      activeEmploymentType,
      activeSalaryRange,
    } = this.state

    return (
      <>
        <Header />
        <div className="jobs-search-container">
          {this.renderJobSearchDetails()}
        </div>
      </>
    )
  }
}

export default Jobs
