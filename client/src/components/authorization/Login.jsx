import { useState } from "react";
import {useDispatch} from "react-redux";
import Input from "../../utils/input/Input";
import "./authorization.scss";
import { login } from "../../actions/user";


const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    return (
        <div className="authorization">
            <h2 className="authorization__header">Authorization</h2>
            <Input value={email}
                   setValue={setEmail} 
                   type="email" 
                   placeholder="Enter your email.."/>
            <Input value={password} 
                   type="password"
                   setValue={setPassword} 
                   placeholder="Enter your password..."/>
            <button className="authorization__btn"
                    onClick={() => dispatch(login(email, password))}>
                        Enter
            </button>
        </div>
    );
};

export default Login;