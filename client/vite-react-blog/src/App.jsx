import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import ProfileMP from "./Pages/ProfileMP/ProfileMP"
import SignInUpMP from "./Pages/SignInUpMP/SignInUpMP"
import BlogPostMP from "./Pages/BlogPostMP/BlogPostMP"
import CreateBlogPostMP from "./Pages/CreateBlogPostMP/CreateBlogPostMP"
import UpdateBlogPostMP from "./Pages/UpdateBlogPostMP/UpdateBlogPostMP"
import "./App.css"
import FollowsMP from "./Pages/FollowsMP/FollowsMP"
import NotificationsMP from "./Pages/NotificationsMP/NotificationsMP"
import MessagesMP from "./Pages/MessagesMP/MessagesMP"
import HomeMP from "./Pages/HomeMP/HomeMP"
import MobileNavbarMS from "./Pages/0Components/MobileNavbarMS/MobileNavbarMS"
import Sidebar from "./Pages/0Components/SidebarMS/SidebarMS"

const App = () => {
  const [showMobileNavbar, setShowMobileNavbar] = useState()
  const [showSidebar, setShowSidebar] = useState()

  const location = useLocation()
  useEffect(() => {

    if (location.pathname === "/") {
      setShowMobileNavbar(false)
      setShowSidebar(false)
    }
    else {
      setShowMobileNavbar(true)
      setShowSidebar(true)
    }

    window.scrollTo(0, 0)

  }, [location])

  return (
    <div className="app">
      {showMobileNavbar ? <MobileNavbarMS /> : null}
      <div className="app-main-display">
        {showSidebar ? <Sidebar /> : null}
        <Routes>
          <Route path={"/"} element={<SignInUpMP />} />
          <Route path={'/home'} element={<HomeMP />} />
          <Route path={'/:username'} element={<ProfileMP />} />
          <Route path={'/blogpost/:blogpostId'} element={<BlogPostMP />} />
          <Route path={'/blogpost/create'} element={<CreateBlogPostMP />} />
          <Route path={'/blogpost/:blogpostId/update'} element={<UpdateBlogPostMP />} />
          <Route path={'/notifications'} element={<NotificationsMP />} />
          <Route path={'/messages'} element={<MessagesMP />} />
          <Route path={'/following'} element={<FollowsMP />} />
          <Route path={'/followers'} element={<FollowsMP />} />
          <Route path="*" render={() => <Redirect to="/" />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
