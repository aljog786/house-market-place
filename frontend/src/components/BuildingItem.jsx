import { Link } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import { FaBed, FaBath } from "react-icons/fa";
import './BuildingItem.css';

const BuildingItem = ({ building, id }) => {
  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
      <Card className="h-100 shadow-sm">
        <Link to={`/building-details/${id}`}>
          <Card.Img
            variant="top"
            src={building.imageUrls[0]}
            alt={building.name}
            className="building-image"
          />
        </Link>
        <Card.Body>
          <Card.Text className="text-muted small mb-1">{building.address}</Card.Text>
          <Card.Title className="mb-2 text-truncate" style={{ fontSize: "1.1rem" }}>
            {building.name}
          </Card.Title>
          <Card.Text className="text-success fw-bold" style={{ fontSize: "1.2rem" }}>
          ₹{building.offer ? building.discountedPrice : building.regularPrice}
            {building.type === 'rent' && " / Month"}
          </Card.Text>
          <Card.Text className="text-muted small">Last updated 3 mins ago</Card.Text>
          <Row className="align-items-center text-center mt-2">
            <Col xs={6} className="d-flex align-items-center justify-content-center">
              <FaBed className="me-1" />
              <span className="small">{building.rooms} rooms</span>
            </Col>
            <Col xs={6} className="d-flex align-items-center justify-content-center">
              <FaBath className="me-1" />
              <span className="small">{building.toilets} baths</span>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default BuildingItem;
