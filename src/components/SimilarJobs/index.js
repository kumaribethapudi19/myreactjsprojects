import {Link} from 'react-router-dom'
import {GoLocation} from 'react-icons/go'
import {FaSuitcase} from 'react-icons/fa'
import {FcRating} from 'react-icons/fc'
import './index.css'

const SimilarJobs = props => {
  const {similarJobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobDetails

  return (
    //   Wrap with Link from react-router-dom
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="job-item">
        <div className="logo-card">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
            className="company-logo-style"
          />
          <div className="titiles">
            <h1 className="hdng">{title}</h1>
            <div className="rating-container">
              <FcRating className="star" />

              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <h1 className="hdng">Description</h1>
        <p className="msg">{jobDescription}</p>
        <div className="location-container">
          <div className="card">
            <button className="location-btn" type="button">
              <GoLocation className="icon-style" />
            </button>
            <p className="msg">{location}</p>

            <button className="location-btn" type="button">
              <FaSuitcase className="icon-style" />
            </button>
            <p className="msg">{employmentType}</p>
          </div>
        </div>
      </li>
    </Link>
  )
}

export default SimilarJobs
