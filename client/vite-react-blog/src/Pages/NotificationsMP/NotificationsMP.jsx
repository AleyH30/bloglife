import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../0Components/SidebarMS/SidebarMS";
import "./NotificationsMP.css"
import PeopleYouMayKnowMS from "../0Components/PeopleYouMayKnowMS/PeopleYouMayKnowMS";

const NotificationsMP = () => {
    const [userId, setUserId] = useState(sessionStorage.getItem('userId'))
    const [isLoading, setIsLoading] = useState(true)
    const Navigate = useNavigate();
    const token = localStorage.getItem('auth-token')

    const GetNotifications = () => {
        if (userId){
            setIsLoading(false)
        }
        else{
            Navigate("/")
        }
    }

    useEffect(() => {
        GetNotifications()
    },[])
    return(
        <div className="notifications-mp">
           {isLoading? null :  <div className="notifications-mp-contents"><h1>Notifications</h1>
           <hr/>
            <p>You have no new notifications.</p></div>}
            <PeopleYouMayKnowMS/>
        </div>
    )

}

export default NotificationsMP