import React from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL, REACT_APP_RAZORPAY_KEY_ID } from "../constants";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const totalAmount = state?.totalAmount ?? 0;

  // Function to handle the payment process using Razorpay
  const displayRazorpay = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // Create order on the backend
    const orderResponse = await fetch(`${BASE_URL}/payments/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: totalAmount }),
    });
    const orderData = await orderResponse.json();

    // Options for the Razorpay checkout
    const options = {
      key: REACT_APP_RAZORPAY_KEY_ID,
      amount: orderData.amount, // amount in paise
      currency: orderData.currency,
      name: "House Marketplace", // your company name
      description: "Test Transaction",
      order_id: orderData.id,
      handler: function (response) {
        alert("Payment successful!");
        navigate("/success");
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Some Address",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow-sm">
            <h2 className="mb-4">Payment</h2>
            <div className="d-flex justify-content-between mb-4">
              <strong>Total:</strong>
              <strong>₹{totalAmount}</strong>
            </div>
            {/* Instead of a form submission, call Razorpay on button click */}
            <Button
              variant="primary"
              onClick={displayRazorpay}
              className="w-100"
            >
              Pay ₹{totalAmount}
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;
