import React, { useState, useContext } from "react";
import "./Login.css";
import Header from "./LoginHeader.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import { UserContext } from "../context/UserContext.jsx";
import { BASE_URL } from "../App.jsx";

const Login = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);
  

  const submitLogin = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" }, //backend Curl in /token
      body: JSON.stringify(
        `grant_type=&username=${name}&password=${password}&scope=&client_id=&client_secret=`
      ), //backend Curl in /token
    };

    const response = await fetch(BASE_URL + "/token", requestOptions); //backend comunication
    const data = await response.json();
    const {user_id, username} = data  //!!!!!!IMPORTANT PART
    
    localStorage.setItem("user_id", user_id)
    localStorage.setItem("username", username)
  

    if (!response.ok) {
      setErrorMessage(data.detail);
    } else {
      setToken(data.access_token); //backend response body in /token
      setErrorMessage("");
      onLogin(name, password); // Call onLogin function passed from parent component
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };

  const handleReset = () => {
    setName("");
    setPassword("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Header />
      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="username">User Name</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="User Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="control no-margin">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="form-actions">
        <ErrorMessage message={errorMessage} />
        <br />
        <p className="form-actions">
        <button className="button" type="submit">
            Log In
          </button>
          <button
            className="button button-flat"
            type="reset"
            onClick={handleReset}
          >
            Reset
          </button>
        </p>
      </div>
    </form>
  );
};

export default Login;
