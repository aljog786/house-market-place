import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import ReactLoading from 'react-loading';
import { Row, Container } from "react-bootstrap";
import BuildingItem from "../components/BuildingItem";

const Category = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { type } = useParams();

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await axios.get('http://localhost:8000/buildings');
        const filteredBuildings = response.data.filter(building => building.type === type);
        setBuildings(filteredBuildings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching buildings:', error);
        setLoading(false);
      }
    };

    fetchBuildings();
  }, [type]); // Re-run the effect when type changes

  return (
    <Container>
      <h2 className="mb-4 mt-4">{type === "rent" ? "Places for Rent" : "Places for Sale"}</h2>
      {loading ? (
        <ReactLoading type="Bars" color="#444"/>
      ) : (
        buildings.length > 0 ? (
          <Row>
            {buildings.map((building) => (
              <BuildingItem building={building} id={building._id} key={building._id}/>
            ))}
          </Row>
        ) : (
          <p>No buildings found for {type}.</p>
        )
      )}
    </Container>
  );
};

export default Category;
