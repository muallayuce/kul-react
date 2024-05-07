import { useParams } from 'react-router-dom';

const Transactions = () => {
    const { result } = useParams();

    return (
        <div>
            {result === 'success' ? (
                <div>
                    <h1>Payment Successful</h1>
                    <p>Your payment was successful. Thank you for your purchase!</p>
                </div>
            ) : result === 'fail' ? (
                <div>
                    <h1>Payment Failed</h1>
                    <p>Unfortunately, your payment failed. Please try again later.</p>
                </div>
            ) : (
                <div>
                    <h1>Error</h1>
                    <p>Invalid transaction result</p>
                </div>
            )}
        </div>
    );
};

export default Transactions;