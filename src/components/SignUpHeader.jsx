import signupImg from '../assets/header.png';

export default function Header() {
    return (
        <header>
            <img className='signUpImg' src={signupImg} alt="Logo" />
            <h1 className='welcome'>Welcome <span className='welcome2'> to the KUL-est network!</span></h1>
        </header>
    );
}