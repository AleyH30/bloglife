import React, {useState, useEffect} from 'react';
import BlogPostMI from '../BlogPostMI/BlogPostMI';
import "./BlogPostsMS.css";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faUserMinus} from '@fortawesome/free-solid-svg-icons'

const BlogPostsMS = (props) => {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const [data, setData] = useState([]);
    const [user, setUser] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingT, setIsLoadingT] = useState(true);
    const [error, setError] = useState(null);
    const userId = sessionStorage.getItem("userId")
    const [isFollowing, setIsFollowing] = useState(true)
    const token = localStorage.getItem("auth-token")
    const [ownership, setOwnership] = useState(false)

    const UpdateFollowingUnfollowing = async (action) => {
        try{
            const response = await fetch (`${baseUrl}/users/${userId}/following/${user._id}`,
            {method: "PATCH",
             headers: {"Content-Type": "application/json", authorization: token},
             body: JSON.stringify({action})})
            
            if (response.ok){
                const data = await response.json()
                setIsFollowing(data.find((otherUser) => otherUser._id === user._id))
            }
        }
        catch (error){
            console.log(error)
        }
    }

    const GetUserInfoByUsername = async () => {
        try{
            const response = await fetch(`${baseUrl}/users/getUserByUsername/${props.username}`)
            if(response.ok){
                const user = await response.json()
                setUser(user);
                setIsFollowing(user.followers.find((followers) => followers === userId))
                if (user._id === userId){
                    setOwnership(true)
                }
                setIsLoadingT(false)
            }
            else{
                setIsLoadingT(false)
            }
        }
        catch(error){
            console.log(error)
        }
    }
    
    const GetBlogPostsByUsername = async () => {
        try{
            const response = await fetch(`${baseUrl}/users/username/${props.username}/blogposts`)
            const data = await response.json()
            if(data.success){
                setData(data);
                setIsLoading(false);
            }
            else{
                alert(data.errors)
                setIsLoading(false)
            }
        }
        catch(error){
            console.log(error)
        }
    }
    const GetUserInfoByUserId = async () => {
        try{
            const response = await fetch(`${baseUrl}/users/${userId}`)
            
            if(response.ok){
                const user = await response.json()
                setUser(user);
                setIsFollowing(user.followers.find((followers) => followers === userId))
                if (user._id === userId){
                    setOwnership(true)
                }
                setIsLoadingT(false);
            }
            else{
                setIsLoadingT(false)
            }
        }
        catch(error){
            console.log(error)
        }
    }
    
    const GetBlogPostsByUserId = async () => {
        try{
            const response = await fetch(`${baseUrl}/users/getBlogPostsByUserId/${userId}`)
            const data = await response.json()
            if(data.success){
                setData(data);
                setIsLoading(false);
            }
            else{
                alert(data.errors)
                setIsLoading(false)
            }
        }
        catch(error){
            console.log(error)
        }
    }


    const location = useLocation()

    useEffect(() => {
        if (props.username === "demouser"){
            GetBlogPostsByUserId()
            GetUserInfoByUserId()
        }
        else{
            GetBlogPostsByUsername()
            GetUserInfoByUsername()
        }
        
    }, [location])

    return (
        <div className='blogposts-ms'>
            {isLoadingT? null :<div className="blogposts-ms-header">
                <div className='blogposts-ms-userinfo'>
                    <div className='blogpost-ms-userpicture'><img src={`${baseUrl}/assets/${user.picturePath}`} alt='' /></div>
                    <h1>@{props.username}'s Posts</h1>
                </div>
                {ownership? null : isFollowing ? <button className="blogposts-ms-unfollow-btn" onClick={() => UpdateFollowingUnfollowing("unfollow")}><FontAwesomeIcon icon={faUserMinus} /> </button> :
                    <button className="blogposts-ms-follow-btn" onClick={() => UpdateFollowingUnfollowing("follow")}><FontAwesomeIcon icon={faUserPlus} /></button>}
            </div>}
            
            <div className='blogposts-ms-contents'>
            {isLoading? (<p>Loading...</p>) : data.blogPosts.length === 0 ? (<p className='blogposts-ms-nopostsmsg'>@{props.username} does not have any posts yet.</p>) : 
            (data.blogPosts.toReversed().map((item) => (
                <BlogPostMI key={item._id} 
                id={item._id}
                username={item.username} 
                userPicturePath={item.userPicturePath}
                title={item.title} 
                text={parse(DOMPurify.sanitize(item.text))} 
                image={item.picturePath === ""? `${baseUrl}/assets/placeholder.jpg` :`${baseUrl}/assets/${item.picturePath}`}
                isLiked ={item.likes[userId]}
                likesNum ={Object.keys(item.likes).length}/>
            )))}
            </div>
        </div>
    )
}

export default BlogPostsMS