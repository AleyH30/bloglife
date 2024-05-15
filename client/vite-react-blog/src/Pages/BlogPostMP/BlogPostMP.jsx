import React, {useState, useEffect} from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import "./BlogPostMP.css";
import Sidebar from '../0Components/SidebarMS/SidebarMS';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faHeart as faHeartR } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartS } from '@fortawesome/free-solid-svg-icons';
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import PeopleYouMayKnowMS from '../0Components/PeopleYouMayKnowMS/PeopleYouMayKnowMS';

const BlogPostMP = () => {
    const baseUrl= import.meta.env.VITE_SERVER_URL
    const [image, setImage] = useState("")
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ownership, setOwnership] = useState(false);
    const [isLiked, setIsLiked] = useState();
    const [likesNum, setLikesNum] = useState()
    const [userId, setUserId] = useState(sessionStorage.getItem("userId"))
    const token = localStorage.getItem('auth-token')
    const Navigate = useNavigate()

    const {blogpostId} = useParams();

    const GetBlogPostById = async () => {
        try{
            const response = await fetch(`${baseUrl}/blogPosts/${blogpostId}`);
            
            if (!response.ok){
                throw new Error("Failed to fetch data.");
            }

            const data = await response.json();
            setData(data);
            setIsLiked(data.likes[userId])
            setLikesNum(Object.keys(data.likes).length)
            userId === data.userId? setOwnership(true) : setOwnership(false) ;
            setIsLoading(false);
        }
        catch (error) {
            console.log(error)
            setError("Error fetching data. Please try again later.");
            setIsLoading(false);
        }
    }

    const LikeUnlikePost = async () => {
        const response = await fetch(`${baseUrl}/blogPosts/${blogpostId}/like`, {
            method: "PATCH",
            headers: {"Content-type":"application/json", authorization: token},
            body: JSON.stringify({userId})
        })
        const updatedPost = await response.json()
        setIsLiked(updatedPost.likes[userId])
        setLikesNum(Object.keys(updatedPost.likes).length)
    }

    useEffect(() => {
        if(userId){
            GetBlogPostById()
        }
        else{
            Navigate("/")
        }
        
    }, [])
    
    return (
        <div className='blogpost-mp'>
            {isLoading? null : 
            <div className='blogpost-ms'>
                <div className='blogpost-ms-contents'>
                    {!ownership ? null : <div className='blogpost-ms-edit-btn-cont'>
                        <Link to={`/blogpost/${blogpostId}/update`} className='blogpost-ms-edit-abtn'>
                            <FontAwesomeIcon icon={faPenToSquare} /> Edit
                        </Link></div>}
                    <div className='res-wrapper-12'>
                        <div className='blogpost-ms-userinfo'>
                            <Link to={`/${data.username}`}><div className='blogpost-ms-userpicture'><img src={`${baseUrl}/assets/${data.userPicturePath}`} alt=''/></div></Link>
                            <Link to={`/${data.username}`}><p className='blogpost-ms-username'>@{data.username}</p></Link>
                        </div>
                        <div className='blogpost-ms-likes-cont' onClick={() => LikeUnlikePost()}>
                            {isLiked ? <FontAwesomeIcon className='blogpost-ms-like-heart-solid' icon={faHeartS} /> :
                                <FontAwesomeIcon className="blogpost-ms-like-heart-reg" icon={faHeartR} />}
                            <p>{likesNum}</p></div>

                    </div>
                    <div className='blogpost-ms-image-container'><img src={data.picturePath === "" ? `${baseUrl}/assets/placeholder.jpg` : `${baseUrl}/assets/${data.picturePath}`} alt="" /></div>
                    <div className='blogpost-ms-title'>{data.title}</div>
                    <div className='blogpost-ms-text'>{parse(DOMPurify.sanitize(data.text))}</div>
                </div>
                </div>}
            <PeopleYouMayKnowMS/>
        </div>
    )
}

export default BlogPostMP