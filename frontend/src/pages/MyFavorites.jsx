import axios from "axios";
import BuildingItem from "../components/BuildingItem";
import { useSelector } from "react-redux";  
import { useState, useEffect } from "react";
import { Row, Container, Spinner, Card, Col } from "react-bootstrap";

const MyFavorites = () => {
  const [loading, setLoading] = useState(true);
  const [buildings, setBuildings] = useState([]);
  
  const favorites = useSelector((state) => state.auth.favorites); // Redux favorites (IDs)

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setBuildings([]);  // Ensure state is cleared if no favorites exist
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get("http://localhost:8000/buildings"); 
        // Filter only favorite buildings
        const favoriteBuildings = data.filter(building => favorites.includes(building._id));
        setBuildings(favoriteBuildings);
      } catch (error) {
        console.error("Error fetching favorite buildings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);  // Runs whenever favorites change

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xl={9} lg={10} md={12}>
          <Card className="shadow-lg">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-success mb-0">My Favorites</h2>
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
                      id={building._id} 
                      key={building._id}
                    />
                  ))}
                </Row>
              ) : (
                <p>No Favorite Properties</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyFavorites;
