import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Sidebar from "../0Components/SidebarMS/SidebarMS";
import "./FollowsMP.css"
import FollowsUserDisplayMI from "./0Components/FollowsUserDisplayMI/FollowsUserDisplayMI";
import PeopleYouMayKnowMS from "../0Components/PeopleYouMayKnowMS/PeopleYouMayKnowMS";

const FollowsMP = (props) => {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const [userId, setUserId] = useState(sessionStorage.getItem('userId'));
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState()
    const [followersInfoArr, setFollowersInfoArr] = useState([])
    const [followingInfoArr, setFollowingInfoArr] = useState([])
    const token = localStorage.getItem('auth-token')
    const [refresh, setRefresh] = useState(true)
    const Navigate = useNavigate();

    const GetFollowers = async () => {
        console.log("should be calling")
        try {
            const response = await fetch(`${baseUrl}/users/${userId}/followers`)

            if (response.ok) {
                const followers = await response.json()
                setFollowersInfoArr(followers)//try going back to folloers.formattedFollowers with curly brackets on backend
                setIsLoading(false)
            }
            else{
                console.log("error fetching followers")
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    const GetFollowing = async () => {
        try {
            const response = await fetch(`${baseUrl}/users/${userId}/following`)

            if (response.ok) {
                const following = await response.json()
                setFollowingInfoArr(following)
                setIsLoading(false)
            }
            else{
                console.log("error fetching followers")
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    const CallRefresh = () => {
        setRefresh(!refresh)
    }

    const location = useLocation()

    useEffect(() => {
        if(userId){
            
            if(location.pathname === "/following"){
                setPage("following")
                GetFollowing()
            }
            else if(location.pathname === "/followers"){
                setPage("followers")
                setFollowersInfoArr([])
                GetFollowers()
            }
        }
        else{
            Navigate("/")
        }
        
    }, [location, refresh])

    return(
        <div className="follows-mp">
             <div className="follows-ms">
                {isLoading ? null : <div className="follows-ms-contents">
                    <h1>{page.charAt(0).toUpperCase() + page.slice(1)}</h1>
                    <hr />
                    {page === "following" ? 
                    <div className="follows-ms-display">
                        {followingInfoArr.length === 0? <p className="follows-ms-display-ntsmsg">You are not following anyone.</p> : 
                        followingInfoArr.map((user) => {
                            var isFollowing;
                            if (user.followers.includes(userId))
                            {isFollowing = true}
                            else{
                                isFollowing = false
                            }
                        return <FollowsUserDisplayMI
                            key={user._id}
                            userId={userId}
                            otherUserId={user._id}
                            name={user.name}
                            username={user.username}
                            picturePath={user.picturePath}
                            isFollowing={isFollowing}
                            followers={user.followers}
                            function={CallRefresh} 
                            refresh={refresh}/>
                        })}
                    </div> : <div className="follows-ms-display">
                        {followersInfoArr.length === 0? <p className="follows-ms-display-ntsmsg">You are not being followed by anyone</p> 
                        : followersInfoArr.map((user) => {
                            var isFollowing;
                            if (user.followers.includes(userId))
                            {isFollowing = true}
                            else{
                                isFollowing = false
                            }
                        return <FollowsUserDisplayMI
                            key={user._id}
                            userId={userId}
                            otherUserId={user._id}
                            name={user.name}
                            username={user.username}
                            picturePath={user.picturePath}
                            isFollowing={isFollowing}
                            followers={user.followers}
                            function={CallRefresh}
                            refresh={refresh} />
                    })}
                    </div>}
                </div>}
            </div>
            <PeopleYouMayKnowMS function={CallRefresh} refresh={refresh}/>
        </div>
    )

}

export default FollowsMP