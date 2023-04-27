import React from 'react';
import {
  CardElement,
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makePayment } from './action';
import styled from 'styled-components';
import { instance } from '../../api/instance';

const CardDetails = () => {
  const navigate = useNavigate();

  window.onbeforeunload = (event) => {
    const e = event || window.event;
    // Cancel the event
    e.preventDefault();
    if (e) {
      e.returnValue = ''; // Legacy method for cross browser support
    }
    return ''; // Legacy method for cross browser support
  };

  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { userdata } = useSelector((state) => state.auth);
  console.log('userData', userdata)

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cardNumberElement = elements?.getElement(CardNumberElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
    });
    if (!error) {
      const { id } = paymentMethod;
      dispatch(
        makePayment({ id: id, userdata: userdata }, () => navigate('/success'))
      );
    } else {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="text-white bg-danger  p-2">
        Please do not close this window or click the Back button on your browser
      </div>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: 400 }}
        className="payment_form"
      >
        <label className="ms-4">Card Number</label>
        <CardInputWrapper>
          <CardNumberElement
            options={{
              style: {
                base: inputStyle,
              },
            }}
          />
        </CardInputWrapper>

        <label className="ms-4">Expire Date</label>
        <CardInputWrapper>
          <CardExpiryElement
            options={{
              style: {
                base: inputStyle,
              },
            }}
          />
        </CardInputWrapper>

        <label className="ms-4">CVC</label>
        <CardInputWrapper>
          <CardCvcElement
            options={{
              style: {
                base: inputStyle,
              },
            }}
          />
        </CardInputWrapper>

        {/* <CardElement /> */}
        <button className="btn btn-success">Pay</button>
      </form>
    </>
  );
};

const inputStyle = {
  iconColor: '#c4f0ff',
  // color: '#ff0',
  fontWeight: '500',
  fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
  fontSize: '16px',
  fontSmoothing: 'antialiased',
  ':-webkit-autofill': {
    color: '#fce883',
  },
  '::placeholder': {
    color: '#87BBFD',
  },
};

const CardInputWrapper = styled.div`
  border: 2px solid #654;
  border-radius: 8px;
  padding: 20px 4px;
  margin-bottom: 1.5rem;
`;

export default CardDetails;
