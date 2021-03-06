import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import UsersContext from '../context/users/UsersContext';
import { Link, useNavigate } from 'react-router-dom';


const Navbar=() => {
  const { user, Cookies }=useContext( UsersContext )
  console.log( user )
  const navigate=useNavigate();

  const goTODashboard=( e ) => {
    navigate( '/dashboard' )
  }

  const handleLogout=( e ) => {
    e.preventDefault();
    Cookies.remove( 'jwt' );
    navigate( '/login' );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
  <div className="container-fluid">
        <Link className="navbar-brand" to="/">Health Care</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="/navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarNavDropdown">
      <ul className="navbar-nav ms-auto ">
            <li className="nav-item ms-4">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
        </li>
            <li className="nav-item dropdown ms-4">
              <a className="nav-link dropdown-toggle" href="/" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">

                <span className='me-2'><FontAwesomeIcon icon={faUser} /></span>

                {user.name}
          </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <li><a className="dropdown-item" onClick={handleLogout} >Logout</a></li>
          </ul>
        </li>
            <li className="nav-item ms-4">

              {user.role!=='doctor'? '':<Link type="button" to="dashboard" className="btn btn-primary" >Dashboard</Link>}
              {/* 
              {user.role!=='doctor'? <button type="button" className="btn btn-primary">My Bookings</button>:<button type="button" className="btn btn-primary" onCLick={goTODashboard}>Dashboard</button>} */}
        </li>
      </ul>
    </div>
  </div>
</nav>

  )
}

export default Navbar