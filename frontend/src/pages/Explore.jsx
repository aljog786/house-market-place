import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

const Explore = () => {
  return (
    <Container className="mt-5">
      <h2 className="mb-4 fw-bold">Explore</h2>
      <h5 className="mb-3">Categories</h5>

      <Row>
        <Col xs={12} md={6} className="mb-4">
          <Link to="/category/rent" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card className="border-0">
              <div style={{ overflow: 'hidden', height: '300px' }}>
                <Card.Img 
                  variant="top" 
                  src={rentCategoryImage} 
                  className="w-100 h-100 object-fit-cover rounded"
                />
              </div>
              <Card.Body className="text-center">
                <Card.Title className="fw-semibold">Places for rent</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col xs={12} md={6} className="mb-4">
          <Link to="/category/sale" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card className="border-0">
              <div style={{ overflow: 'hidden', height: '300px' }}>
                <Card.Img 
                  variant="top" 
                  src={sellCategoryImage} 
                  className="w-100 h-100 object-fit-cover rounded"
                />
              </div>
              <Card.Body className="text-center">
                <Card.Title className="fw-semibold">Places for sale</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Explore;
