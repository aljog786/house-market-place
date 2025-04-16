import { useSelector } from "react-redux";
import { Row, Container, Spinner, Card, Col, Button } from "react-bootstrap";
import BuildingItem from "../components/BuildingItem";
import { useNavigate } from "react-router-dom";
import { useGetBuildingsQuery } from "../slices/buildingsApiSlice";

const MyProperties = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const {
    data: buildingsData = [],
    isLoading,
    isError,
    error,
  } = useGetBuildingsQuery();

  const myBuildings = userInfo
    ? buildingsData.filter(
        (building) => building.userRef && building.userRef._id === userInfo._id
      )
    : [];

  const handleAddProperty = () => {
    navigate("/profile/create-building");
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

              {isLoading ? (
                <div className="d-flex justify-content-center p-5">
                  <Spinner animation="border" variant="success" />
                </div>
              ) : isError ? (
                <p>
                  Error fetching buildings:{" "}
                  {error?.data?.message || error.error}
                </p>
              ) : myBuildings.length > 0 ? (
                <Row>
                  {myBuildings.map((building) => (
                    <BuildingItem
                      building={building}
                      id={building._id}
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
