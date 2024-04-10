import loginImg from '../assets/kul.png';

export default function Header() {
    return (
        <header>
            <img className='loginImg' src={loginImg} alt="Kul" />
            <h1 className='welcome'>Welcome</h1>
        </header>
    );
}