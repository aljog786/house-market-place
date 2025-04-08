import { Container, Row, Spinner, Card, Col } from "react-bootstrap";
import BuildingItem from "../components/BuildingItem";
import { useSelector } from "react-redux";  
import { useGetUserFavoritesQuery } from "../slices/usersApiSlice";

const MyFavorites = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?._id;

  const { data: buildings = [], isLoading, isError, error } = useGetUserFavoritesQuery(userId, { skip: !userId });

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xl={9} lg={10} md={12}>
          <Card className="shadow-lg">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-success mb-0">My Favorites</h2>
              </div>
              {isLoading ? (
                <div className="d-flex justify-content-center p-5">
                  <Spinner animation="border" variant="success" />
                </div>
              ) : isError ? (
                <p>Error fetching favorites: {error?.data?.message || error.error}</p>
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
