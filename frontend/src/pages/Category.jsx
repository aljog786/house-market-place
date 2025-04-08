import { useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { Row, Container } from 'react-bootstrap';
import BuildingItem from '../components/BuildingItem';
import { useGetBuildingsQuery } from '../slices/buildingsApiSlice';

const Category = () => {
  const { type } = useParams();
  const { data: buildings = [], isLoading, error } = useGetBuildingsQuery();

  const filteredBuildings = buildings.filter((building) => building.type === type);

  return (
    <Container>
      <h2 className="mb-4 mt-4">{type === 'rent' ? 'Places for Rent' : 'Places for Sale'}</h2>
      {isLoading ? (
        <ReactLoading type="Bars" color="#444" />
      ) : error ? (
        <p className="text-danger">Error loading buildings: {error?.data?.message || error.error}</p>
      ) : filteredBuildings.length > 0 ? (
        <Row>
          {filteredBuildings.map((building) => (
            <BuildingItem building={building} id={building._id} key={building._id} />
          ))}
        </Row>
      ) : (
        <p>No buildings found for {type}.</p>
      )}
    </Container>
  );
};

export default Category;
