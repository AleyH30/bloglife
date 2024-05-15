import React, {useState, useEffect} from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import BlogPostsMS from '../0Components/BlogPostsMS/BlogPostsMS';
import SidebarMS from '../0Components/SidebarMS/SidebarMS';
import "./ProfileMP.css";

const Profile = () => {
    const {username} = useParams();
    const [userId, setUserId] = useState(sessionStorage.getItem('userId'));
    const Navigate = useNavigate()

    useEffect(() => {
        if (userId){
        }
        else{
            Navigate("/")
        }
    }, [])

    return (
        <div className='profile-mp'>
            <div className='profile-mp-container'>
                <BlogPostsMS username={username}/>
            </div>
        </div>
    )
}

export default Profile