import {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserMinus, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import "./FollowsUserDisplayMI.css"

const FollowsUserDisplayMI = (props) => {
    const baseUrl= import.meta.env.VITE_SERVER_URL
    const token = localStorage.getItem("auth-token")
    const [isFollowing, setIsFollowing] = useState(props.followers.find((followers) => followers === props.userId))
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
                props.function()
            }
        }
        catch (error){
            console.log(error)
        }
        setShowSpinner(false)
    }

    const updateIsfollowing = () => {
        props.cf? setIsFollowing(props.cf.find((cf) => cf === props.otherUserId)) : null;
    }

    useEffect(() => {
        updateIsfollowing()
    }, [props.refresh, props.cf])

    return(
        <div className="follows-user-display-mi">
            <div className="fud-mi-userinfo">
                <Link to={`/${props.username}`}></Link><div className="fud-mi-userpicture"><img src={`${baseUrl}/assets/${props.picturePath}`} alt='' /></div>
                <Link to={`/${props.username}`}><div className="fud-mi-names-cont">
                    <p>{props.name}</p>
                    <p>@{props.username}</p>
                </div></Link>
                
            </div>
            {isFollowing? <button className="fud-mi-unfollow-btn" onClick={() => UpdateFollowingUnfollowing("unfollow")}><FontAwesomeIcon icon={faUserMinus} style={{display: showSpinner? "none" : "inline-block"}}/><FontAwesomeIcon className="fud-mi-spinner" icon={faCircleNotch} style={{display: showSpinner? "inline-block" : "none"}} spin /></button> :
            <button className="fud-mi-follow-btn" onClick={() => UpdateFollowingUnfollowing("follow")}><FontAwesomeIcon icon={faUserPlus} style={{display: showSpinner? "none" : "inline-block"}}/><FontAwesomeIcon className="fud-mi-spinner" icon={faCircleNotch} style={{display: showSpinner? "inline-block" : "none"}} spin /></button>}
        </div>
    )
}

export default FollowsUserDisplayMI