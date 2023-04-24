import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CardDetails from './CardDetails';

const stripeTestPromise = loadStripe(
  'pk_test_51Mq775SGaNLJ20WFD9FufxBll5pD7yFCZCpUjvdibVNhx9FdDHFdDhngoHUp2IdCsSvfN9AAmxZugkroMnS6zp2v00NuN0NrSP'
);

const StripePayment = () => {
  return (
    <Elements stripe={stripeTestPromise}>
      <CardDetails />
    </Elements>
  );
};

export default StripePayment;
