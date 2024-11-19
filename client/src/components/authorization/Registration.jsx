import { useState } from "react";
import Input from "../../utils/input/Input";
import "./authorization.scss";
import { registration } from "../../actions/user";

const Registration = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="authorization">
            <h2 className="authorization__header">Registration</h2>
            <Input value={email}
                   setValue={setEmail} 
                   type="email" 
                   placeholder="Enter your email.."/>
            <Input value={password} 
                   type="password"
                   setValue={setPassword} 
                   placeholder="Enter your password..."/>
            <button className="authorization__btn"
                    onClick={() => registration(email, password)}>
                        Enter
            </button>
        </div>
    );
};

export default Registration;