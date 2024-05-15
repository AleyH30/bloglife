import {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./BlogPostFormMI.css"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faBan } from '@fortawesome/free-solid-svg-icons'

const BlogPostFormMI = (props) => {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const [action, setAction] = useState(props.action)
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [file, setFile] = useState("");
    const [storedImage, setStoredImage] = useState("")

    const [submitted, setSubmitted] = useState("");
    const [isLoading, setIsLoading] = useState("")
    const {blogpostId} = useParams();
    const Navigate = useNavigate()

    const GetBlogPostInfo = () => {
        setTitle(props.data.title)
        setText(props.data.text)
        setStoredImage(props.data.picturePath)
        setIsLoading(false)
    }

    const modules = {
        toolbar: [
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            /*['link' , 'image'],*/
            ['clean']
        ],
    }
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link' /*, 'image'*/
    ]
    const ClickSubmit = (e) => {
        e.preventDefault()

        if (title === "" || text.replace(/<(.|\n)*?>/g, '').trim().length === 0){
            alert("Must enter title and body to submit")
        }
        else{
            props.function(title, text, file === "" ? storedImage : file)
        }
    }
    useEffect(() => {
        if (action === "update"){
            GetBlogPostInfo()
        }
        else if (action === "create"){
            setIsLoading(false)
        }
    }, [])

    return (
        <div className='blogpost-form'>
                {isLoading? null : 
                (<div className='blogpost-form-contents'>{action !== "update"? null : <div className='blogpost-form-action-btns'>
                    <button className='blogpost-form-cancel-btn' title={"cancel"} onClick={() => Navigate(`/blogpost/${blogpostId}`)}><FontAwesomeIcon icon={faBan} /></button>
                    <button className='blogpost-form-delete-btn' title={"delete"} onClick={(e) => props.delete(e)}><FontAwesomeIcon icon={faTrashCan} /></button>
                    </div>}
                <form>
                    <input className="blogpost-form-image-selector"  title="Choose image" type="file" onChange={e => setFile(e.target.files[0])} accept='png, jpg, jpeg'/>
                    {(storedImage ==="") && (file === "")? null : <div className='blogpost-form-image-display'>
                        <img className="blogpost-form-image-display-img" src={file === ""? `${baseUrl}/assets/${storedImage}` : URL.createObjectURL(file)} alt=''/>
                        </div>}
                    <input className="blogpost-form-title" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                    <div className='blogpost-form-text-cont'>
                        <ReactQuill className='blogpost-form-text' modules={modules} formats={formats} value={text} onChange={setText} />
                    </div>
                    <button className='blogpost-form-submit-btn' type="submit" onClick={(e) => {ClickSubmit(e)}}>{props.btn}</button>
                </form></div>)}
            </div>
    )
}

export default BlogPostFormMI