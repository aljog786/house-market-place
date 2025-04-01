import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { BASE_URL } from "../constants";

const OtpInput = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert(data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={6} lg={4} xl={4}>
          <h3 className="text-center">Enter OTP</h3>
          <p className="text-center text-muted">
            Please check your email for the OTP.
          </p>
          <Form onSubmit={handleSubmit} className="text-center">
            <Form.Control
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleChange}
              maxLength="6"
              className="text-center fs-4 border rounded mb-4"
            />
            <Button type="submit" className="mt-4 w-100 btn btn-success">
              Verify & Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default OtpInput;
