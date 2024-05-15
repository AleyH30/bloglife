import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../0Components/SidebarMS/SidebarMS";
import "./MessagesMP.css"
import PeopleYouMayKnowMS from "../0Components/PeopleYouMayKnowMS/PeopleYouMayKnowMS";

const MessagesMP = () => {
    const [userId, setUserId] = useState(sessionStorage.getItem('userId'))
    const [isLoading, setIsLoading] = useState(true)
    const Navigate = useNavigate();
    const token = localStorage.getItem('auth-token')

    const GetMessages = () => {
        if (userId){
            setIsLoading(false)
        }
        else{
            Navigate("/")
        }
    }

    useEffect(() => {
        GetMessages()
    })
    return(
        <div className="messages-mp">
           {isLoading? null :  <div className="messages-mp-contents"><h1>Messages</h1>
           <hr/>
            <p>You have no new messages.</p></div>}
            <PeopleYouMayKnowMS/>
        </div>
    )

}

export default MessagesMP