import { Link } from "react-router-dom";
import "./navbar.scss";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../reducers/userReducer";
import Logo from "../../assets/Component_1.png"

const Navbar = () => {

    const isAuth = useSelector(state => state.user.isAuth);
    const dispatch = useDispatch();

    return (
        <div className="navbar">
            <div className="container">
                <img src={Logo} alt="logo" />
                <div className="navbar__header">MERN Cloud</div>
                {!isAuth && <Link to="/login" className="navbar__login">Login</Link>}
               {!isAuth && <Link to="/registration" className="navbar__registration">Registration</Link>}
               {isAuth && <Link className="navbar__login" onClick={() => dispatch(logout())}>Exit</Link>}
            </div>
        </div>
    );
};

export default Navbar;