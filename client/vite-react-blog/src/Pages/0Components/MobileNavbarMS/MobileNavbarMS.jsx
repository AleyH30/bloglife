import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark, faPlus, faHouse, faBell, faEnvelope, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
import "./MobileNavbarMS.css"

const MobileNavbarMS = () => {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const [userId, setUserId] = useState(sessionStorage.getItem("userId"))
    const [user, setUser] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [token, setToken] = useState(localStorage.getItem("auth-token"))
    const [sidebarActive, setSidebarActive] = useState(false);
    const [page, setPage] = useState()
    const Navigate = useNavigate()

    const RetrieveUserInfo = async () => {
        const response = await fetch(`${baseUrl}/users/${userId}`)
        const user = await response.json()
        setUser(user)
        setIsLoading(false)
    }

    const ClickLogOut = () => {
        setSidebarActive(false)
        localStorage.removeItem('auth-token');
        sessionStorage.removeItem('userId');
        Navigate('/')
    }

    const Width = () => {
        var width = window.innerWidth;
        if (width > 700){
            setSidebarActive(false);
        }
      }
    window.addEventListener('resize', Width)

    const location = useLocation()
    useEffect(() => {
        setPage(location.pathname)
    }, [location])

    useEffect(() => {
        RetrieveUserInfo()
    
    }, [])

    useEffect(() => {
        document.body.style.overflow = sidebarActive ? "hidden" : "unset";
      }, [sidebarActive]);

    return(
        <>
            <div className="mobile-navbar-ms-top">
                <div className="mobile-navbar-ms-top-contents">
                    <p className="mobile-navbar-ms-top-logo"><Link to={`/home`}> BlogLife</Link></p>
                    <button className="mobile-navbar-ms-side-toggle-btn" onClick={() => setSidebarActive(true)}><FontAwesomeIcon icon={faBars} /></button>
                </div>
            </div>

            <div className="mobile-navbar-ms-side-bg-close-btn" style={{ display: sidebarActive ? "block" : "none" }} onClick={() => setSidebarActive(false)}></div>
            <div className="mobile-navbar-ms-side" style={{ display: sidebarActive ? "block" : "none" }}>
                <div className="mobile-navbar-ms-side-contents">
                <div className='mobile-navbar-ms-side-userdisplay'>
                    <div className='mobile-navbar-ms-side-user-image'><img src={`${baseUrl}/assets/${user.picturePath}`} alt='' /></div>
                    <p>{user.name}</p>
                    <p>@{user.username}</p>
                </div>
                    <button className="mobile-navbar-ms-side-x-close-btn" onClick={() => setSidebarActive(false)}><FontAwesomeIcon icon={faXmark} /></button>
                    <nav className="nav">
                        <ul className="mobile-navbar-ms-side-links">
                            <li className={page === "/blogpost/create" ? 'side-ms-placeholder' : null} onClick={() => setSidebarActive(false)}><Link to={`/blogpost/create`}><FontAwesomeIcon className="mob-nav-links-i" icon={faPlus} /> <p>Create</p></Link></li>
                            <li className={page === "/home" ? 'side-ms-placeholder' : null} onClick={() => setSidebarActive(false)}><Link to={"/home"} ><FontAwesomeIcon className="mob-nav-links-i" icon={faHouse} /> <p>Home</p></Link></li>
                            <li className={page === `/${user.username}` ? 'side-ms-placeholder' : null} onClick={() => setSidebarActive(false)}><Link to={`/${user.username}`} ><FontAwesomeIcon className="mob-nav-links-i" icon={faUsers} /> <p>Profile</p></Link></li>
                            <li className={page === "/notifications" ? 'side-ms-placeholder' : null} onClick={() => setSidebarActive(false)}><Link to={"/notifications"} ><FontAwesomeIcon className="mob-nav-links-i" icon={faBell} /> <p>Notifications</p></Link></li>
                            <li className={page === "/messages" ? 'side-ms-placeholder' : null} onClick={() => setSidebarActive(false)}><Link to={"/messages"} ><FontAwesomeIcon className="mob-nav-links-i" icon={faEnvelope} /> <p>Messages</p></Link></li>
                            <li className={page === "/following" ? 'side-ms-placeholder' : null} onClick={() => setSidebarActive(false)}><Link to={"/following"} ><FontAwesomeIcon className="mob-nav-links-i" icon={faUser} /> <p>Following</p></Link></li>
                            <li className={page === "/followers" ? 'side-ms-placeholder' : null} onClick={() => setSidebarActive(false)}><Link to={"/followers"} ><FontAwesomeIcon className="mob-nav-links-i" icon={faUsers} /> <p>Followers</p></Link></li>
                        </ul>
                    </nav>
                    <button className="mobile-navbar-ms-side-logout-btn" onClick={() => ClickLogOut()}>Log Out</button>
                </div>
            </div>
        </>
    )

}

export default MobileNavbarMS