import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { name,email, password } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100" style={{ maxWidth: "400px" }}>
        <Col>
          <h2 className="text-center mb-4">Register</h2>
          <Form>
          <Form.Group className="mb-3" controlId="formName">
              <InputGroup>
                <InputGroup.Text>
                <CgProfile />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </Form.Group>
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
              onClick={() => navigate("/home")}
            >
              Register
            </Button>

            <div className="text-center mt-3">
              <Link to="/login" className="text-decoration-none">
                Sign-in Instead
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
