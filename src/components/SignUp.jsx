import './SignUp.css';
import Header from './SignUpHeader';
import { UserContext } from '../context/UserContext';
import { useContext, useState } from 'react';
import ErrorMessage from './ErrorMessage';
import {BASE_URL} from '../App';

export default function Signup() {
  const [email, setEmail] = useState ('');
  const [password, setPassword] = useState ('');
  const [confirmPassword, setConfirmPassword] = useState ('');
  const [username, setUsername] = useState ('');
  const [errorMessage, setErrorMessage] = useState ('');
  const [, setToken] = useContext(UserContext);

  const submitRegistration = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: email, password: password, username: username})
    };

    console.log(BASE_URL);
    const response = await fetch(BASE_URL + '/users/', requestOptions);
    const data = await response.json();

    console.log("response: ", response)
    
    if (!response.ok) {
        setErrorMessage(data.detail);
    } else {
      setToken(data.acces_token);
    } 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    if (password !== null &&
      password === confirmPassword &&
      password.length >= 8 &&
      specialCharacters.test(password)) {
      submitRegistration();
      setErrorMessage();
    } else {
      setErrorMessage('Please ensure that the passwords match and are at least 8 characters long and contains 1 special character');
    }
  };

  const handleReset = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
  };

    return (
      <form onSubmit={handleSubmit}>
        <Header/>
  
        <div className="control-row">
          <div className="control">
          <label htmlFor="email">Email</label>
          <input 
          id="e-mail" type="suemail" name="email" placeholder='Email' 
          value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
  
          <div className="control">
            <label htmlFor="password">Password</label>
            <input id="supassword" type="password" name="password" placeholder='Password' 
            value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
  
          <div className="control">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              name="confirm-password"
              placeholder='Confirm Password'
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
  
        <hr />
  
        <div className="control-row">
          <div className="control">
            <label htmlFor="first-name" id='firstnametag'>First Name</label>
            <input type="text" id="first-name" name="first-name" placeholder='First Name' />
          </div>
  
          <div className="control">
            <label htmlFor="last-name">Last Name</label>
            <input type="text" id="last-name" name="last-name" placeholder='Last Name'/>
          </div>

          <div className="control">
            <label htmlFor="user-name">User Name</label>
            <input type="text" id="user-name" name="user-name" placeholder='User Name'
            value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

        </div>
  
        <div className="checkbox">
          <label htmlFor="terms-and-conditions">
            <input type="checkbox" id="terms-and-conditions" name="terms" /> I
            agree to the terms and conditions
          </label>
        </div>

        <div className="form-actions">
          <ErrorMessage message={errorMessage}/>
          <br/> 
          <button type="submit" className="button">
            Sign Up
          </button>
          <button type="reset" className="button button-flat" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    );
  }