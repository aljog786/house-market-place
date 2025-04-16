// hmp-main/frontend/src/pages/Success.jsx
import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  const handleHomeRedirect = () => {
    // Redirect user to homepage (or any desired path)
    navigate("/");
  };

  return (
    <Container className="my-5 d-flex justify-content-center">
      <Card
        className="p-4 shadow-sm"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h1 className="text-center mb-4">Payment Successful!</h1>
        <p className="text-center">
          Your payment was completed successfully. Thank you for your purchase!
        </p>
        <div className="d-flex justify-content-center mt-4">
          <Button variant="primary" onClick={handleHomeRedirect}>
            Go to Home
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default Success;
