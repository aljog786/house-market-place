import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { Row, Container, Spinner, Card, Col, Button } from "react-bootstrap";
import BuildingItem from "../components/BuildingItem";
import { useNavigate } from "react-router-dom";

const MyProperties = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) return;
    const fetchBuildings = async () => {
      try {
        const response = await axios.get("http://localhost:8000/buildings");
        const filteredBuildings = response.data.filter(
          (building) => building.userRef._id === userInfo._id
        );
        console.log(filteredBuildings)
        setBuildings(filteredBuildings);
      } catch (error) {
        console.error("Error fetching buildings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuildings();
  }, [userInfo]);

  const handleAddProperty = () => {
    navigate('/profile/create-building');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xl={9} lg={10} md={12}>
          <Card className="shadow-lg">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-success mb-0">My Properties</h2>
                <Button variant="success" onClick={handleAddProperty}>
                  Add New Property
                </Button>
              </div>

              {loading ? (
                <div className="d-flex justify-content-center p-5">
                  <Spinner animation="border" variant="success" />
                </div>
              ) : buildings.length > 0 ? (
                <Row>
            {buildings.map((building) => (
              <BuildingItem
                building={building}
                id={building._id}  // Ensure you're using _id here
                key={building._id}
              />
            ))}
          </Row>
              ) : (
                <p>No Properties</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyProperties;