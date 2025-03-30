import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Container, Card, Badge, Nav, Image } from 'react-bootstrap';
import { FaUserEdit } from "react-icons/fa";
import { FaCircleChevronRight } from "react-icons/fa6";
import { MdOutlineAddHomeWork } from "react-icons/md";
import { GoHomeFill } from "react-icons/go";
import { MdFavorite } from "react-icons/md";
import { useGetUserFavoritesQuery } from '../slices/usersApiSlice';
import { useGetBuildingsQuery } from '../slices/buildingsApiSlice'; // Make sure this endpoint is created

const Profile = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data: favorites = [] } =
  useGetUserFavoritesQuery(userInfo?._id, { skip: !userInfo });

  const { data: buildings = [] } =
  useGetBuildingsQuery(undefined, { 
    selectFromResult: ({ data }) => ({
      data: data?.filter(b => b.userRef._id === userInfo?._id) || []
    }),
    skip: !userInfo 
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!userInfo) {
    navigate('/login');
    return null;
  }

  const menuItems = [
    { 
      title: 'Sell / Rent Property', 
      icon: <MdOutlineAddHomeWork size={23} className="text-primary" />, 
      path: '/profile/create-building',
      badge: 'New'
    },
    { 
      title: 'My Favorites', 
      icon: <MdFavorite size={23} className="text-danger" />, 
      path: '/profile/favorites' 
    },
    { 
      title: 'My Properties', 
      icon: <GoHomeFill size={23} className="text-secondary" />, 
      path: '/profile/properties' 
    }
  ];

  return (
    <div className="profile-page bg-light min-vh-100">
      <Container className="py-3">
        <Card className="profile-card border-0 shadow-sm mb-4 overflow-hidden" style={{ 
          borderRadius: '16px', 
          transition: 'all 0.3s ease',
        }}>
          <Card.Body className="p-0">
            <Row className="g-0">
              <Col md={4} className="profile-bg d-flex align-items-center justify-content-center py-4" style={{ 
                background: 'linear-gradient(45deg, #f3f4f6 0%, #e5e7eb 100%)',
              }}>
                <div className="text-center">
                  <div className="mb-3 position-relative mx-auto" style={{ width: '120px', height: '120px' }}>
                    <Image 
                      src={userInfo?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo?.name)}&background=random`} 
                      roundedCircle 
                      className="border border-4 border-white shadow-sm" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </Col>
              <Col md={8}>
                <div className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h4 className="fw-bold mb-1">{userInfo?.name}</h4>
                      <p className="mb-0 text-muted">{userInfo?.email}</p>
                    </div>
                    <Link to="/profile/edit" className="btn btn-outline-primary btn-sm d-flex align-items-center">
                      <FaUserEdit className="me-2" />
                      {windowWidth > 576 ? 'Edit Profile' : ''}
                    </Link>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mt-4">
                    <div className="stat-box bg-primary bg-opacity-10 text-primary p-3 rounded flex-grow-1 text-center">
                      <h3 className="mb-1">{buildings.length}</h3>
                      <small>Properties</small>
                    </div>
                    <div className="stat-box bg-success bg-opacity-10 text-success p-3 rounded flex-grow-1 text-center">
                      <h3 className="mb-1">{favorites.length}</h3>
                      <small>Favorites</small>
                    </div>
                    <div className="stat-box bg-info bg-opacity-10 text-info p-3 rounded flex-grow-1 text-center">
                      <h3 className="mb-1">3</h3>
                      <small>Messages</small>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <div className="menu-cards mb-4">
          <h5 className="fw-bold mb-3">Quick Actions</h5>
          <Row xs={1} md={2} lg={3} className="g-3">
            {menuItems.map((item, index) => (
              <Col key={index}>
                <Link to={item.path} className="text-decoration-none">
                  <Card 
                    className="border-0 h-100 menu-card" 
                    style={{ 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                  >
                    <Card.Body className="d-flex align-items-center p-4">
                      <div className="me-3 d-flex align-items-center justify-content-center rounded-circle bg-light" style={{ width: '48px', height: '48px' }}>
                        {item.icon}
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-0 d-flex align-items-center">
                          {item.title}
                          {item.badge && (
                            <Badge bg="danger" className="ms-2" pill>{item.badge}</Badge>
                          )}
                        </h6>
                      </div>
                      <FaCircleChevronRight size={20} className="ms-2 text-muted" />
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>

        <div className="mb-4">
          <h5 className="fw-bold mb-3">Recent Activity</h5>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <Card.Body className="p-0">
              <Nav variant="tabs" className="border-0 px-3 pt-2">
                <Nav.Item>
                  <Nav.Link active className="border-0 border-bottom-0 text-primary">All</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className="border-0 text-muted">Properties</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className="border-0 text-muted">Messages</Nav.Link>
                </Nav.Item>
              </Nav>
              
              <div className="p-3">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className={`d-flex py-2 ${index !== 2 ? 'border-bottom' : ''}`}>
                    <div className="me-3 bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                      <GoHomeFill size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="mb-0 fw-medium">Your property listing was viewed 5 times</p>
                      <small className="text-muted">2 hours ago</small>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default Profile;
