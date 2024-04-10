import './SignUp.css';
import Header from './SignUpHeader'

export default function Signup() {
    return (
      <form>
        <Header/>
  
        <div className="control">
          <label htmlFor="email">Email</label>
          <input id="e-mail" type="suemail" name="email" placeholder='Email' />
        </div>
  
        <div className="control-row">
          <div className="control">
            <label htmlFor="password">Password</label>
            <input id="supassword" type="password" name="password" placeholder='Password' />
          </div>
  
          <div className="control">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              name="confirm-password"
              placeholder='Confirm Password'
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
        </div>
  
        <div className="checkbox">
          <label htmlFor="terms-and-conditions">
            <input type="checkbox" id="terms-and-conditions" name="terms" />I
            agree to the terms and conditions
          </label>
        </div>
  
        <p className="form-actions">
          <button type="reset" className="button button-flat">
            Reset
          </button>
          <button type="submit" className="button">
            Sign up
          </button>
        </p>
      </form>
    );
  }