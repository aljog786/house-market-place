import { useState, useEffect } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import { Row, Container } from "react-bootstrap";
import BuildingItem from "../components/BuildingItem";

const Offers = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await axios.get("http://localhost:8000/buildings");
        const filteredBuildings = response.data.filter(
          (building) => building.offer === true
        );
        setBuildings(filteredBuildings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching buildings:", error);
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  return (
    <Container>
      <h2 className="mb-4 mt-4">Offers</h2>
      {loading ? (
        <ReactLoading type="Bars" color="#444" />
      ) : (
        buildings.length > 0 ? (
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
          <p>No current offers.</p>
        )
      )}
    </Container>
  );
};

export default Offers;
