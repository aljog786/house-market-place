import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, InputGroup, Card } from "react-bootstrap";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { BASE_URL } from "../constants";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cnfPassword: ''
  });

  const { name, email, password, cnfPassword } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== cnfPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
        credentials: "include", // include cookies
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("OTP sent to your email!");
        // Navigate to OTP verification page
        navigate("/register/otp");
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center" 
      style={{ background: "linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)" }}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={6} lg={4} xl={4}>
          <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
            <Card.Header className="bg-success text-white text-center py-4">
              <h3 className="font-weight-bold mb-0">Create Account</h3>
              <p className="mb-0">Join our marketplace community</p>
            </Card.Header>
            <Card.Body className="px-4 py-5">
              <Form onSubmit={handleSubmit}>
                {/* Name Input */}
                <Form.Group className="mb-4" controlId="formName">
                  <Form.Label className="fw-semibold text-secondary">Full Name</Form.Label>
                  <InputGroup className="mb-1">
                    <InputGroup.Text className="bg-light border">
                      <CgProfile className="text-success" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      name="name"
                      value={name}
                      onChange={handleChange}
                      required
                      className="py-2 fs-6"
                    />
                  </InputGroup>
                </Form.Group>
                {/* Email Input */}
                <Form.Group className="mb-4" controlId="formEmail">
                  <Form.Label className="fw-semibold text-secondary">Email Address</Form.Label>
                  <InputGroup className="mb-1">
                    <InputGroup.Text className="bg-light border">
                      <FaEnvelope className="text-success" />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      required
                      className="py-2 fs-6"
                    />
                  </InputGroup>
                </Form.Group>
                {/* Password Input */}
                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label className="fw-semibold text-secondary">Password</Form.Label>
                  <InputGroup className="mb-1">
                    <InputGroup.Text className="bg-light border">
                      <FaLock className="text-success" />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      name="password"
                      value={password}
                      onChange={handleChange}
                      required
                      className="py-2 fs-6"
                    />
                    <Button
                      variant="light"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="border"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Password must be at least 6 characters long
                  </Form.Text>
                </Form.Group>
                {/* Confirm Password Input */}
                <Form.Group className="mb-4" controlId="formPasswordConfirm">
                  <Form.Label className="fw-semibold text-secondary">Confirm Password</Form.Label>
                  <InputGroup className="mb-1">
                    <InputGroup.Text className="bg-light border">
                      <FaLock className="text-success" />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      name="cnfPassword"
                      value={cnfPassword}
                      onChange={handleChange}
                      required
                      className="py-2 fs-6"
                    />
                    <Button
                      variant="light"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="border"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    {password === cnfPassword ? "Password matches" : "Password does not match"}
                  </Form.Text>
                </Form.Group>
                {/* Submit Button */}
                <Button
                  variant="success"
                  type="submit"
                  className="w-100 py-3 fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2 mt-4"
                  style={{ 
                    transition: "all 0.3s ease-in-out",
                    boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)"
                  }}
                >
                  <span>Send OTP</span>
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="bg-light py-3 text-center">
              <p className="mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-decoration-none text-success fw-bold">
                  Sign In
                </Link>
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
