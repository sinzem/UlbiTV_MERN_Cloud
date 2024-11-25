import { Link } from "react-router-dom";
import "./navbar.scss";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../reducers/userReducer";
import Logo from "../../assets/Component_1.png"
import { useState } from "react";
import { getFiles, searchFiles } from "../../actions/file";
import { showLoader } from "../../reducers/appReducer";

const Navbar = () => {

    const isAuth = useSelector(state => state.user.isAuth);
    const currentDir = useSelector(state => state.files.currentDir);
    const [searchName, setSearchName] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(false);
    const dispatch = useDispatch();

    function searchChangeHandler(e) {
        setSearchName(e.target.value);
        if (searchTimeout !== false) {
            clearTimeout(searchTimeout);
        }
        dispatch(showLoader());
        if (e.target.value !== "") {
            setSearchTimeout(setTimeout((value) => { /* (запускаем таймаут в пол-секунды, чтобы при вводе каждого символа не отправлять запрос на сервер) */
                dispatch(searchFiles(value));
            }, 500, e.target.value))
        } else {
            dispatch(getFiles(currentDir)); /* (если строка запроса пустая, выводим файлы текущей директории(иначе при возврате(back) выводит все вложенные папки)) */
        }
        
    }

    return (
        <div className="navbar">
            <div className="container">
                <img src={Logo} alt="logo" />
                <div className="navbar__header">MERN Cloud</div>
                {isAuth && <input className="navbar__search" 
                                  type="text" 
                                  placeholder="File name..." 
                                  value={searchName}
                                  onChange={(e) => searchChangeHandler(e)}/>}
                {!isAuth && <Link to="/login" className="navbar__login">Login</Link>}
                {!isAuth && <Link to="/registration" className="navbar__registration">Registration</Link>}
                {isAuth && <Link className="navbar__login" onClick={() => dispatch(logout())}>Exit</Link>}
            </div>
        </div>
    );
};

export default Navbar;