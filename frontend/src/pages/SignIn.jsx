import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  Alert,
  Card,
} from "react-bootstrap";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import { useLoginMutation } from "../slices/usersApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      dispatch(setCredentials(userData));
      navigate(`/profile/${userData._id}`);
    } catch (err) {
      setError(err?.data?.message || "Failed to log in. Please try again.");
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center" 
      style={{ 
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={6} lg={4} xl={4}>
          <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
            <Card.Header className="bg-primary text-white text-center py-4">
              <h3 className="font-weight-bold mb-0">Welcome Back</h3>
              <p className="mb-0">Sign in to continue to your account</p>
            </Card.Header>
            <Card.Body className="px-4 py-5">
              {error && (
                <Alert variant="danger" className="animate__animated animate__shake">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </div>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Email Input */}
                <Form.Group className="mb-4" controlId="formEmail">
                  <Form.Label className="fw-semibold text-secondary">Email Address</Form.Label>
                  <InputGroup className="mb-1">
                    <InputGroup.Text className="bg-light border">
                      <FaEnvelope className="text-primary" />
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
                      <FaLock className="text-primary" />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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
                </Form.Group>

                {/* Forgot Password */}
                <div className="text-end mb-4">
                  <Link
                    to="/forgot-password"
                    className="text-decoration-none text-primary"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-3 fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2"
                  disabled={isLoading}
                  style={{ 
                    transition: "all 0.3s ease-in-out",
                    boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)"
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <FaSignInAlt />
                      <span>Sign In</span>
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="bg-light py-3 text-center">
              <p className="mb-0">
                Don't have an account?{" "}
                <Link to="/register" className="text-decoration-none text-primary fw-bold">
                  Create Account
                </Link>
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;