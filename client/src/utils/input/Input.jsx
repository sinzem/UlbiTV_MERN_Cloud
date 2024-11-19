import "./input.scss";

const Input = (props) => {
    return (
        <input type={props.type} 
                placeholder={props.placeholder}
                value={props.value}
                onChange={(event) => props.setValue(event.target.value)}/>
    )
}

export default Input;