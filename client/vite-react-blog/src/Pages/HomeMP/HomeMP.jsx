import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarMS from '../0Components/SidebarMS/SidebarMS';
import "./HomeMP.css";
import PeopleYouMayKnowMS from '../0Components/PeopleYouMayKnowMS/PeopleYouMayKnowMS';
import HomeFeedBlogPostMI from './0Components/HomeFeedBlogPostMI/HomeFeedBlogPostMI';
import parse from "html-react-parser";
import DOMPurify from "dompurify";

const HomeMP = () => {
    const baseUrl = import.meta.env.VITE_SERVER_URL
    const [userId, setUserId] = useState(sessionStorage.getItem('userId'))
    const [data, setData] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const Navigate = useNavigate()

    const GetHomeFeedBlogPosts = async () => {
        try{
            const response = await fetch(`${baseUrl}/blogPosts/getBlogPostsOfFollowing/${userId}`)

            if (response.ok) {
                const data = await response.json()
                setData(data)
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (userId){
            GetHomeFeedBlogPosts()
        }
        else{
            Navigate("/")
        }
        
    }, [])

    return (
        <div className='home-mp'>
            <div className='home-ms'>
                <div className='home-ms-header'>
                    <h1>Home Feed</h1>
                    <hr />
                </div>
                <div className='home-ms-contents'>
                    {isLoading? null : (data.length === 0? <p className='home-ms-contents-ntsmsg'>Your home feed is empty. Try following more people.</p> 
                    : data.toReversed().map((item) => (
                        <HomeFeedBlogPostMI
                            key={item._id}
                            id={item._id}
                            username={item.username}
                            userPicturePath={item.userPicturePath}
                            title={item.title}
                            text={parse(DOMPurify.sanitize(item.text))}
                            image={item.picturePath === "" ? `${baseUrl}/assets/placeholder.jpg` : `${baseUrl}/assets/${item.picturePath}`}
                            isLiked={item.likes[userId]}
                            likesNum={Object.keys(item.likes).length} />
                    )))}
                </div>
            </div>
            <PeopleYouMayKnowMS/>
        </div>
    )
}

export default HomeMP