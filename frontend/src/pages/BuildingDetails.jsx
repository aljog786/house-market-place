import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner, Carousel, Badge } from "react-bootstrap";
import { FaBed, FaBath, FaCar, FaCouch, FaMapMarkerAlt, FaPhone, FaShoppingCart } from "react-icons/fa";
import WishlistButton from "../components/WishlistButton";
import { useAddToCartMutation } from '../slices/usersApiSlice';

const BuildingDetails = () => {
const navigate = useNavigate();
  const { id } = useParams();
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuildingDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/buildings/${id}`);
        setBuilding(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching building details:", error);
        setLoading(false);
      }
    };

    fetchBuildingDetails();
  }, [id]);

  const userId = useSelector((state) => state.auth.userInfo?._id);
  const [addToCart] = useAddToCartMutation();
  const handleBuyNow = async () => {
    if (!userId) {
      console.error('User not logged in');
      return;
    }
    try {
      await addToCart({ userId, buildingId: id }).unwrap();
      navigate('/cart');
    } catch (error) {
      console.error('Failed to add to cart', error);
    }
  };
  
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!building) {
    return (
      <Container className="text-center mt-5">
        <h4>Building not found.</h4>
      </Container>
    );
  }

  const handleSendInquiry = () => {
    if (!building) return;
    navigate('/profile/chats', { state: { building } });
  };

  return (
    <Container className="my-5">
      <div className="position-relative">
        <WishlistButton id={id} />
        <Carousel fade className="mb-4 rounded shadow-lg overflow-hidden">
          {building.imageUrls.map((url, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100 rounded"
                src={url}
                alt={`Building ${index + 1}`}
                style={{ maxHeight: "500px", objectFit: "cover" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <Row>
        <Col md={8}>
          <Card className="shadow-lg p-4 border-0 rounded-4 glass-effect">
            <Card.Body>
              <h2 className="fw-bold text-primary">{building.name}</h2>
              <p className="text-muted"><FaMapMarkerAlt className="text-danger me-2" /> {building.address}</p>

              <h4 className="text-success fw-bold">
                ₹{building.offer ? building.discountedPrice : building.regularPrice}
                {building.type === "rent" && " / Month"}
              </h4>

              {building.offer && (
                <p className="text-danger fw-semibold">
                  Discounted from: <span className="text-decoration-line-through">₹{building.regularPrice}</span>
                </p>
              )}

              <div className="mb-3">
                <Badge bg="info" className="me-2">{building.type === "rent" ? "For Rent" : "For Sale"}</Badge>
                {building.furnished && <Badge bg="secondary" className="me-2">Furnished</Badge>}
                {building.parking && <Badge bg="dark">Parking Available</Badge>}
              </div>

              <Row className="gy-3 text-center">
                <Col xs={6} md={3}>
                  <FaBed size={30} className="text-primary mb-2" />
                  <p className="mb-0">{building.rooms} Rooms</p>
                </Col>
                <Col xs={6} md={3}>
                  <FaBath size={30} className="text-info mb-2" />
                  <p className="mb-0">{building.toilets} Baths</p>
                </Col>
                <Col xs={6} md={3}>
                  <FaCar size={30} className="text-warning mb-2" />
                  <p className="mb-0">{building.parking ? "Parking Available" : "No Parking"}</p>
                </Col>
                <Col xs={6} md={3}>
                  <FaCouch size={30} className="text-success mb-2" />
                  <p className="mb-0">{building.furnished ? "Furnished" : "Unfurnished"}</p>
                </Col>
              </Row>

              <Button 
                variant="danger" 
                className="mt-4 w-100 fw-bold"
                onClick={handleBuyNow}
              >
                <FaShoppingCart className="me-2" /> Buy Now
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-lg p-4 border-0 text-center rounded-4 bg-light">
            <Card.Body>
              <h5 className="fw-bold">Interested in this property?</h5>
              <p className="text-muted">Contact the owner for more details</p>
              <Button variant="primary" className="w-100 mb-2">
                <FaPhone className="me-2" /> Call Now
              </Button>
              <Button variant="outline-primary" className="w-100" onClick={handleSendInquiry}>
                Send Inquiry
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BuildingDetails;
