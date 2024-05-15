import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartR } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartS } from '@fortawesome/free-solid-svg-icons';
import "./HomeFeedBlogPostMI.css";

const HomeFeedBlogPostMI = (props) => {
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
        <div className='homefeedbp-mi'>
            <Link className="homefeedbp-mi-contents" to={`/blogPost/${props.id}`} >
                <div className='homefeedbp-mi-img-container'><img className='homefeedbp-mi-img' src={props.image} alt='' /></div>
                <p className='homefeedbp-mi-title'>{props.title}</p>
                <div className='homefeedbp-mi-text'>{props.text.length > 200 ? `${props.text.substring(0, 200)}...` : props.text}</div>
            </Link>
            <div className='homefeedbp-mi-userinfo'>
                <Link to={`/${props.username}`}><div className='homefeedbp-mi-userpicture'><img src={`${baseUrl}/assets/${props.userPicturePath}`} alt='' /></div></Link>
                <Link to={`/${props.username}`}><p className='homefeedbp-mi-username'>@{props.username}</p></Link>
            </div>
            <div className='homefeedbp-mi-likes-cont' onClick={() => LikeUnlikePost()}>
                {isLiked ? <FontAwesomeIcon className='homefeedbp-mi-like-heart-solid' icon={faHeartS} /> :
                    <FontAwesomeIcon className="homefeedbp-mi-like-heart-reg" icon={faHeartR} />}
                <p>{likesNum}</p></div>
        </div>
    )
}

export default HomeFeedBlogPostMI