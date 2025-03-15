import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, InputGroup, Alert } from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useLoginMutation } from "../slices/usersApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password }).unwrap();
      console.log("userData from login:", userData);
      dispatch(setCredentials(userData));  // Store user data in Redux
      navigate(`/profile/${userData._id}`);  // Redirect to the profile page with user ID
    } catch (err) {
      setError(err?.data?.message || "Failed to log in. Please try again.");
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100" style={{ maxWidth: "400px" }}>
        <Col>
          <h2 className="text-center mb-4">Welcome Back!</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <InputGroup>
                <InputGroup.Text>
                  <FaEnvelope />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <InputGroup>
                <InputGroup.Text>
                  <FaLock />
                </InputGroup.Text>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                />
                <InputGroup.Text
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              className="w-100 d-flex align-items-center justify-content-center"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
            <div className="d-flex justify-content-between mb-3">
              <Link to="/forgot-password" className="text-decoration-none">
                Forgot Password
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;