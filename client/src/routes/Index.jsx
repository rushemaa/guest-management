import { BrowserRouter, Route, Routes } from "react-router-dom"
// import Home from "../pages/Home"
import Login from "../components/Login"
import Home from "../components/Home"
import AddGuest from "../components/Add-guest"
import Guests from "../components/Guests"
import Admin from "../components/Admin"
import Guest from "../components/Guest"

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />

                <Route
                    exact
                    path='/home'
                    element={<Home />}
                />
                <Route
                    exact
                    path='/add-guest'
                    element={<AddGuest />}
                />
                <Route
                    exact
                    path='/guests/:status'
                    element={<Guests />}
                />
                <Route
                    exact
                    path='/guest/:id'
                    element={<Guest />}
                />
                <Route
                    exact
                    path='/admin'
                    element={<Admin />}
                />

            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes