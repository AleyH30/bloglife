import {useState} from 'react';
import {Link} from 'react-router-dom';
import "./BlogPostMI.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartR } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartS } from '@fortawesome/free-solid-svg-icons';

const BlogPostMI= (props) => {
    const baseUrl= import.meta.env.VITE_SERVER_URL
    const [likesNum, setLikesNum] = useState(props.likesNum)
    const [isLiked, setIsLiked] = useState(props.isLiked)
    const token = localStorage.getItem('auth-token')
    const userId = sessionStorage.getItem('userId')
    

    const LikeUnlikePost = async () => {
        const response = await fetch(`${baseUrl}/blogPosts/${props.id}/like`, {
            method: "PATCH",
            headers: {"Content-type":"application/json", authorization: token},
            body: JSON.stringify({userId})
        })
        const updatedPost = await response.json()
        setIsLiked(updatedPost.likes[userId])
        setLikesNum(Object.keys(updatedPost.likes).length)
    }
    
    return (
        
        <div className='blogpost-mi'>
            <Link className='blogpost-mi-contents' to={`/blogPost/${props.id}`} >
                <div className='blogpost-mi-img-container'><img className='blogpost-mi-img' src={props.image} alt='' /></div>
                <p className='blogpost-mi-title'>{props.title}</p>
                <div className='blogpost-mi-text'>{props.text.length > 200 ? `${props.text.substring(0, 200)}...` : props.text}</div>

            </Link>
            <div className='blogpost-mi-userinfo'>
                <div className='blogpost-mi-userpicture'><img src={`${baseUrl}/assets/${props.userPicturePath}`} alt='' /></div>
                <p className='blogpost-mi-username'>{props.username}</p>
            </div>
            <div className='blogpost-mi-likes-cont' onClick={() => LikeUnlikePost()}>
                {isLiked ? <FontAwesomeIcon className='blogpost-mi-like-heart-solid' icon={faHeartS} /> :
                    <FontAwesomeIcon className="blogpost-mi-like-heart-reg" icon={faHeartR} />}
                <p>{likesNum}</p></div>
        </div>
        
    )
}

export default BlogPostMI