import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import "./SignInUpMP.css"

const SignInUpMP = () => {
    const [userId, setUserId] = useState(sessionStorage.getItem('userId'));
    const baseUrl = import.meta.env.VITE_SERVER_URL
    const [state, setState] = useState('Sign In');
    const [formData, setFormData] = useState({
        fullname:"",
        username:"",
        password:"",
        email:""
    })
    const [demoFormData, setDemoFormData] = useState({
        fullname:"Demo User",
        username:"demouser",
        password:"password123",
        email:"dmfake@gmail.com",
        picturePath:"user_demo.jpg"
    })

    const Navigate = useNavigate()

    const ChangeHandler = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const SignUp = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch (`${baseUrl}/auth/register`, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(formData)
            })
            const data = await response.json()
            if (data.success) {
                alert(data.message);
                localStorage.setItem('auth-token', data.token)
                sessionStorage.setItem('userId', data.userId)
                Navigate(`/home`)
            }
            else {
                alert(data.errors)
            }
            
        }catch (error) {
            console.log(error)
        }
    }

    const SignInWithDemo = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch (`${baseUrl}/auth/registerDemoUser`, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(demoFormData)
            })
            const data = await response.json()
            if (data.success) {
                localStorage.setItem('auth-token', data.token)
                sessionStorage.setItem('userId', data.userId)
                Navigate(`/home`)
            }
            else {
                alert(data.errors)
            }
            
        }catch (error) {
            console.log(error)
        }
    }

    const SignIn = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(`${baseUrl}/auth/login`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(formData)
            })
            const data = await response.json()
            if (data.success) {
                localStorage.setItem('auth-token', data.token)
                sessionStorage.setItem('userId', data.userId)
                Navigate(`/home`)
            }
            else {
                alert(data.errors)
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (userId){
            Navigate("/home")
        }
        else{
            
        }
    }, [])

    return (
        <div className='signinup-mp'>
            <div className="signinup-mp-contents">
                <div className='signinup-mp-logo'>BlogLife</div>
                <h1>{state}</h1>
                <form>
                    <div className="signinup-fields">
                        {state === "Sign Up" ?
                        <>
                            <div className='form-group'>
                            <label htmlFor='fullname'>Full Name:</label>
                            <input id='fullname' name='fullname' value={formData.fullname} onChange={ChangeHandler} type="text" placeholder="Full Name" />
                        </div>
                            <div className='form-group'>
                                <label htmlFor='email'>Email:</label>
                                <input id='email' name='email' value={formData.email} onChange={ChangeHandler} type="email" placeholder="Email Address" />
                            </div></> : <></>}
                        <div className='form-group'>
                            <label htmlFor='username'>Username:</label>
                            <input id='username' name='username' value={formData.username} onChange={ChangeHandler} type="text" placeholder="Username" />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='password'>Password:</label>
                            <input id='password' name='password' value={formData.password} onChange={ChangeHandler} type="password" placeholder="Password" />
                        </div>
                    </div>
                    <button className='signinup-btn' type='submit' onClick={(e) => { state === "Sign In" ? SignIn(e) : SignUp(e) }}>{state}</button>
                    <button className='signinup-btn' type='submit' onClick={(e) => { SignInWithDemo(e) }}>Sign In With Demo</button>
                    {/* {state === "Sign Up" ?
                        <>
                            <div className="signinup-agree">
                                <input type="checkbox" name='' id='checkbox' />
                                <label htmlFor='checkbox'></label>
                                <p>By continuing, I agree to the terms of use & privacy policy</p>
                            </div>
                            <p className="signinup-login">
                                Already have an account? <span onClick={() => { setState("Sign In") }}>Sign In</span>
                            </p>
                        </>
                        :
                        <p className="signinup-login">
                            Don't have an account? <span onClick={()=>{setState("Sign Up")}}>Sign Up</span>
                        </p>} */}
                </form>
            </div>
        </div>
    )
}

export default SignInUpMP