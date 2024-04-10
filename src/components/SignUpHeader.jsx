import signupImg from '../assets/header.png';

export default function Header() {
    return (
        <header>
            <img className='signUpImg' src={signupImg} alt="Logo" />
            <h1 className='welcome'>Welcome to the KUL-est network!</h1>
        </header>
    );
}