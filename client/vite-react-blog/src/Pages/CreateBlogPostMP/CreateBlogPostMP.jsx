import { useEffect } from 'react';
import Sidebar from '../0Components/SidebarMS/SidebarMS';
import BlogPostFormMI from '../0Components/BlogPostFormMI/BlogPostFormMI';
import "./CreateBlogPostMP.css";
import { useNavigate } from 'react-router-dom';
import PeopleYouMayKnowMS from '../0Components/PeopleYouMayKnowMS/PeopleYouMayKnowMS';

const CreateBlogPostMP= () => {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const Navigate = useNavigate()
    const token = localStorage.getItem("auth-token")
    const userId = sessionStorage.getItem("userId")
    
    const CreateBlogPost = async (title, text, file)  => {
        try {
            const formdata = new FormData()
            formdata.append('file', file)
            formdata.append('title', title)
            formdata.append('text', text)
            formdata.append('userId', userId)

            const response = await fetch(`${baseUrl}/blogPosts/createBlogPost`, {
                method: "POST",
                headers: { authorization: token },
                body: formdata
            })

            if (response.ok) {
                const data = await response.json()
                Navigate(`/blogPost/${data._id}`)
            }
        }
        catch (error) {
            console.log(error);
        }
        
    }

    useEffect(() => {
        if (userId){
        }
        else{
            Navigate("/")
        }
        
    }, [])

    
    return (
        <div className='create-blogpost-mp'>
            <BlogPostFormMI action={"create"} btn="Create Post" function={CreateBlogPost}/>
            <PeopleYouMayKnowMS/>
        </div>
    )
}

export default CreateBlogPostMP