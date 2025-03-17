import { Row, Col, Container, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaPowerOff } from "react-icons/fa";
import { FaCartShopping,FaCircleChevronRight } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { logout } from '../slices/authSlice';

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!userInfo) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Container className="py-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="fw-bold">My Profile</h2>
        </Col>
        <Col xs="auto">
            <FaCartShopping className='text-success mx-4' style={{ cursor: 'pointer' }} size={22}/>
            <FaPowerOff fill='#900C3F' style={{ cursor: 'pointer' }} size={22} onClick={handleLogout}/>
        </Col>
      </Row>

      <Card className="p-3 mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col xs={8}>
              <h5 className="mb-1 fw-bold">{userInfo?.name}</h5>
              <p className="mb-0 text-muted">{userInfo?.email}</p>
            </Col>
            <Col xs="auto" className="text-end">
              <Link to="/update-profile" className="text-decoration-none text-success fw-bold">
                update
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Link to='/profile/create-building' className='text-decoration-none'>
      <Card className="p-3" style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Card.Body>
          <Row className="justify-content-between align-self-center">
            <Col>
              <GoHomeFill size={23} className="text-dark" />
            </Col>
            <Col xs={6}>
              <p className="fw-bold">Sell / Rent</p>
            </Col>
            <Col className='text-center'>
              <FaCircleChevronRight size={23} className="text-dark" />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      </Link>
    </Container>
  );
};

export default Profile;
