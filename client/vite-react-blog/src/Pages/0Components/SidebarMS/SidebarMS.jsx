import React, {useState, useEffect} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import "./SidebarMS.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faHouse, faBell, faEnvelope, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'

const Sidebar = () => {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const [userId, setUserId] = useState(sessionStorage.getItem("userId"))
    const [user, setUser] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [token, setToken] = useState(localStorage.getItem("auth-token"))
    const [hide, setHide] = useState(false)
    const [page, setPage] = useState()

    const Navigate = useNavigate()

    const RetrieveUserInfo = async () => {
        const response = await fetch(`${baseUrl}/users/${userId}`)
        const user = await response.json()
        setUser(user)
        setIsLoading(false)
    }

    const ClickLogOut = () => {
        localStorage.removeItem('auth-token');
        sessionStorage.removeItem('userId');
        Navigate('/')
    }

    useEffect(() => {
        if (userId){
            RetrieveUserInfo()
        }
        else{
            setHide(true)
        }
        
    }, [])
    
    const location = useLocation()
    useEffect(() => {
        setPage(location.pathname)
    }, [location])

    return (
        <div className= {hide? "sidebar-ms-hide" : 'sidebar-ms'}>
            {isLoading? null : <div className='sidebar-ms-contents'>
                <h1><Link to={`/home`}> BlogLife</Link></h1>
                <div className='sidebar-ms-userdisplay'>
                    <div className='sidebar-ms-user-image'><img src={`${baseUrl}/assets/${user.picturePath}`} alt='' /></div>
                    <p>{user.name}</p>
                    <p>@{user.username}</p>
                </div>
                <nav>
                    <ul className="nav-links">
                        <li className={page==="/blogpost/create"? 'sidebar-ms-placeholder': null}><Link to={`/blogpost/create`}><FontAwesomeIcon className="nav-links-i" icon={faPlus}/> <p>Create</p></Link></li>
                        <li className={page==="/home"? 'sidebar-ms-placeholder': null}><Link to={"/home"} ><FontAwesomeIcon className="nav-links-i" icon={faHouse}/> <p>Home</p></Link></li>
                        <li className={page===`/${user.username}`? 'sidebar-ms-placeholder': null}><Link to={`/${user.username}`} ><FontAwesomeIcon className="nav-links-i" icon={faUsers}/> <p>Profile</p></Link></li>
                        <li className={page==="/notifications"? 'sidebar-ms-placeholder': null}><Link to={"/notifications"} ><FontAwesomeIcon className="nav-links-i" icon={faBell}/> <p>Notifications</p></Link></li>
                        <li className={page==="/messages"? 'sidebar-ms-placeholder': null}><Link to={"/messages"} ><FontAwesomeIcon className="nav-links-i" icon={faEnvelope}/> <p>Messages</p></Link></li>
                        <li className={page==="/following"? 'sidebar-ms-placeholder': null}><Link to={"/following"} ><FontAwesomeIcon className="nav-links-i" icon={faUser}/> <p>Following</p></Link></li>
                        <li className={page==="/followers"? 'sidebar-ms-placeholder': null}><Link to={"/followers"} ><FontAwesomeIcon className="nav-links-i" icon={faUsers}/> <p>Followers</p></Link></li>
                    </ul>
                </nav>
                <button className="sidebar-ms-logout-btn" onClick={() => ClickLogOut()}>Log Out</button>
            </div>}
        </div>
    )
}

export default Sidebar