import { Row, Container } from "react-bootstrap";
import BuildingItem from "../components/BuildingItem";
import { useGetBuildingsQuery } from "../slices/buildingsApiSlice";
import ReactLoading from "react-loading";

const Offers = () => {
  const { data: buildingsData = [], isLoading, isError, error } = useGetBuildingsQuery();

  const offerBuildings = buildingsData.filter((building) => building.offer === true);

  return (
    <Container className="mb-5">
      <h2 className="mb-4 mt-4">Offers</h2>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <ReactLoading type="Bars" color="#444" />
        </div>
      ) : isError ? (
        <p>Error: {error?.data?.message || error.error}</p>
      ) : offerBuildings.length > 0 ? (
        <Row>
          {offerBuildings.map((building) => (
            <BuildingItem
              building={building}
              id={building._id}
              key={building._id}
            />
          ))}
        </Row>
      ) : (
        <p>No current offers.</p>
      )}
    </Container>
  );
};

export default Offers;
