import { useState } from "react";
import './Login.css';
import './LoginHeader.jsx';
import Header from "./LoginHeader.jsx";

export default function Login() {
    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');

    function handleSubmit(event) {
        event.preventDefault();

        console.log(('User email: ' + enteredEmail) + (' User password: ' + enteredPassword));

    }

    function handleEmailChange(event) {
        setEnteredEmail(event.target.value);
    }

    function handlePasswordChange(event) {
        setEnteredPassword(event.target.value);
    }

    return (
        <form onSubmit={handleSubmit}>
        <Header/>
        <div className="control-row">
            <div className="control no-margin">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" onChange={handleEmailChange} value={enteredEmail} placeholder="Email"/>
            </div>

            <div className="control no-margin">
            <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" onChange={handlePasswordChange} value={enteredPassword} placeholder="Password"/>
            </div>
        </div>

        <p className="form-actions">
            <button className="button button-flat">Reset</button>
            <button className="button">Log In</button>
        </p>
        </form>
    );
}