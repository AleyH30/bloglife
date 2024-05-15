import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Sidebar from '../0Components/SidebarMS/SidebarMS';
import BlogPostFormMI from '../0Components/BlogPostFormMI/BlogPostFormMI';
import "./UpdateBlogPostMP.css"
import PeopleYouMayKnowMS from '../0Components/PeopleYouMayKnowMS/PeopleYouMayKnowMS';

const UpdateBlogPostMP= () => {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const [data, setData] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const token = localStorage.getItem("auth-token")
    const [fruit, setFruit] = useState("melon")
    const {blogpostId} = useParams()
    const Navigate = useNavigate();
    const [userId, setUserId] = useState(sessionStorage.getItem('userId'));

    const GetBlogPostById = async () => {
        try{
            const response = await fetch(`${baseUrl}/blogPosts/${blogpostId}`);
            
            if (!response.ok){
                throw new Error("Failed to fetch data.");
            }

            const data = await response.json();
            setData(data);
            setIsLoading(false)
        }
        catch (error) {
            console.log(error)
            setError("Error fetching data. Please try again later.");
        }
    }

    useEffect(() => {
        if(userId){
            GetBlogPostById()
        }
        else{
            Navigate("/")
        }
    }, [])

    const UpdateBlogPost = async (title, text, file) =>{

        try {
            const formdata = new FormData()
            formdata.append('file', file)
            formdata.append('title', title)
            formdata.append('text', text)

            const response = await fetch(`${baseUrl}/blogPosts/${blogpostId}`, {
                method: "PUT",
                headers: { authorization: token},
                body: formdata
            })

            if (response.ok) {
                Navigate(`/blogPost/${blogpostId}`);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    const RemoveBlogPost = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(`${baseUrl}/blogPosts/${blogpostId}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json", authorization: token}
            });

            if (response.ok) {
                const data = await response.json()
                Navigate(`/${data.username}`);
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    
    return (
        <div className='update-blogpost-mp'>
            {isLoading? null: <BlogPostFormMI btn="Update Post" 
            action={"update"} 
            data={data} 
            function={UpdateBlogPost} 
            delete={RemoveBlogPost} />}
            <PeopleYouMayKnowMS/>
        </div>
    )
}

export default UpdateBlogPostMP