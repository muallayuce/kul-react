import loginImg from './assets/kul.png';

export default function Header() {
    return (
        <header>
            <img src={loginImg} alt="Kul" />
            <h1>Welcome</h1>
        </header>
    );
}