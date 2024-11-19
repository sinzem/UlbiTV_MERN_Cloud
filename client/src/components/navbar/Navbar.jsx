import { Link } from "react-router-dom";
import "./navbar.scss";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="container">
                <div className="navbar__logo">LOGO</div>
                <div className="navbar__header">MERN Cloud</div>
                <Link to="/login" className="navbar__login">Login</Link>
                <Link to="/registration" className="navbar__registration">Registration</Link>
            </div>
        </div>
    );
};

export default Navbar;