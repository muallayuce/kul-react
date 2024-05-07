import { useParams } from 'react-router-dom';
import './Transaction.css'
import Kul from '../assets/kul.png'

const Transactions = () => {
    const { result } = useParams();

    return (
        <div className='result-container'>
            {result === 'success' ? (
                <div>
                    <h1 className='payment-result'>Payment Successful</h1>
                    <p className='result-detail'>Your payment was successful.</p>
                    <div className='transaction-img-container'>
                        <img src={Kul} className='transaction-img'></img>
                    </div>
                    <p className='detail-info'>Thank you for your purchase!</p>
                </div>
            ) : result === 'fail' ? (
                <div>
                    <h1 className='payment-result'>Payment Failed</h1>
                    <div className='transaction-img-container'>
                        <i className="bi bi-emoji-frown" id='sad-icon-pay'></i>
                        <i className="bi bi-x-octagon-fill" id='x-icon-pay'></i>
                    </div>
                    <p className='result-detail'>Unfortunately, your payment failed. </p>
                    <p className='detail-info'>Please try again later or contact your bank.</p>
                </div>
            ) : (
                <div className='error-pay-container'>
                    <h1 className='error-title'>Error</h1>
                    <i className="bi bi-x-octagon-fill" id='error-icon-pay'></i>
                    <p className='error-pay-info'> Invalid transaction result</p>
                </div>
            )}
        </div>
    );
};

export default Transactions;