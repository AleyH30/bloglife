import {useEffect, useState} from "react";
import "./PeopleYouMayKnowMS.css"
import SuggestedPersonMI from "./0Components/SuggestedPersonMI/SuggestedPersonMI";

const PeopleYouMayKnowMS = (props) => {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const userId = sessionStorage.getItem('userId')
    const [usersArr, setUsersArr] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    var suggestions = false;

    const GetUsers = async () => {
        try{
            const response = await fetch(`${baseUrl}/users/`)

            if (response.ok) {
                const usersArr = await response.json()
                const updatedUsersArr = usersArr.filter((user) => user._id !== userId)
                setUsersArr(updatedUsersArr)
                setIsLoading(false)
            }
        }
        catch(error){
            console.log(error)
        }
        
    }

    useEffect(() =>{
        GetUsers()
    }, [props.refresh])

    return(
        <div className="pymk-ms">
            <h1>People You May Know</h1>
            {isLoading? null : <div className="pymk-ms-contents">
                {usersArr.map((user) => {
                    if (!user.followers.includes(userId))
                    { suggestions = true;
                      return <SuggestedPersonMI
                    key={user._id}
                    userId = {userId}
                    otherUserId={user._id}
                    name={user.name} 
                    username={user.username} 
                    picturePath={user.picturePath} 
                    followers={user.followers}
                    function={props.function}
                    />
                    
                    }
                }
                )}
                {isLoading? null : (suggestions? null : <p className="pymk-ms-ntsmsg">No new suggestions</p>)}
            </div>}
        </div>
    )
}

export default PeopleYouMayKnowMS