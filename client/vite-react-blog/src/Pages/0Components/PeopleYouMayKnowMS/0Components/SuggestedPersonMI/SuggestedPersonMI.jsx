import {useState} from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faUserMinus, faCircleNotch} from '@fortawesome/free-solid-svg-icons'
import { faUser} from '@fortawesome/free-regular-svg-icons'
import "./SuggestedPersonMI.css"

const SuggestedPersonMI = (props) => {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const [isFollowing, setIsFollowing] = useState(props.followers.find((followers) => followers === props.userId))
    const token = localStorage.getItem("auth-token")
    const [showSpinner, setShowSpinner] = useState(false)

    const UpdateFollowingUnfollowing = async (action) => {
        setShowSpinner(true)
        try{
            const response = await fetch (`${baseUrl}/users/${props.userId}/following/${props.otherUserId}`,
            {method: "PATCH",
             headers: {"Content-Type": "application/json", authorization: token},
             body: JSON.stringify({action})})
            
            if (response.ok){
                const data = await response.json()
                setIsFollowing(data.find((otherUser) => otherUser._id === props.otherUserId))
                props.function? props.function() : null
            }
        }
        catch (error){
            console.log(error)
        }
        setShowSpinner(false)
    }

    return(
        <div className="suggestedperson-mi">
            <div className="sp-mi-userinfo">
                <Link to={`/${props.username}`}><div className="sp-mi-userpicture"><img src={`${baseUrl}/assets/${props.picturePath}`} alt='' /></div></Link>
                <Link to={`/${props.username}`}><div className="sp-mi-names-cont">
                    <p>{props.name}</p>
                    <p>@{props.username}</p>
                </div></Link>
                
            </div>
            {isFollowing? <button className="sp-mi-unfollow-btn" onClick={() => UpdateFollowingUnfollowing("unfollow")}><FontAwesomeIcon icon={faUserMinus} style={{display: showSpinner? "none" : "inline-block"}}/> 
            <FontAwesomeIcon className="sp-mi-spinner" icon={faCircleNotch} style={{display: showSpinner? "inline-block" : "none"}} spin /></button> :
            <button className="sp-mi-follow-btn" onClick={() => UpdateFollowingUnfollowing("follow")}><FontAwesomeIcon icon={faUserPlus} style={{display: showSpinner? "none" : "inline-block"}}/>
            <FontAwesomeIcon className="sp-mi-spinner" icon={faCircleNotch} style={{display: showSpinner? "inline-block" : "none"}} spin /></button>}

        </div>
    )
}

export default SuggestedPersonMI