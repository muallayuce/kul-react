import { useState } from "react";
import './Login.css';
import './LoginHeader.jsx';
import Header from "./LoginHeader.jsx";

export default function Login() {
    const [enteredUserName, setEnteredUserName] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');

    function handleSubmit(event) {
        event.preventDefault();

        console.log(('User Name: ' + enteredUserName) +('.') + (' User password: ' + enteredPassword));

    }

    function handleUserNameChange(event) {
        setEnteredUserName(event.target.value);
    }

    function handlePasswordChange(event) {
        setEnteredPassword(event.target.value);
    }

    const handleReset = () => {
        setEnteredUserName('');
        setEnteredPassword('');
    };

    return (
        <form onSubmit={handleSubmit}>
        <Header/>
        <div className="control-row">
            <div className="control no-margin">
                <label htmlFor="username">User Name</label>
                <input id="username" type="text" name="username" onChange={handleUserNameChange} value={enteredUserName} placeholder="User Name"/>
            </div>

            <div className="control no-margin">
            <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" onChange={handlePasswordChange} value={enteredPassword} placeholder="Password"/>
            </div>
        </div>

        <p className="form-actions">
            <button className="button button-flat" type="reset" onClick={handleReset}>Reset</button>
            <button className="button">Log In</button>
        </p>
        </form>
    );
}