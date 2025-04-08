import { Container, Row, Col, Card, Carousel, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg";
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg";
import { useGetBuildingsQuery } from "../slices/buildingsApiSlice";

const Explore = () => {
  const { data: buildingsData = [], isLoading, isError, error } = useGetBuildingsQuery();
  const filteredBuildings = buildingsData.filter(
    (building) => building.offer === true
  ).slice(0, 5);

  return (
    <Container className="mt-5 mb-5">
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : isError ? (
        <div className="text-center text-danger">
          Error: {error?.data?.message || error.error}
        </div>
      ) : (
        <>
          <Carousel className="mb-5 shadow-lg rounded-4 overflow-hidden">
            {filteredBuildings.map((building) => (
              <Carousel.Item key={building._id}>
                <div className="position-relative" style={{ height: "60vh" }}>
                  <img
                    src={building.imageUrls[0]}
                    className="d-block w-100 h-100 object-fit-cover"
                    alt={building.name}
                  />
                  <div className="carousel-caption d-none d-md-block text-start bg-dark bg-opacity-75 p-4 rounded">
                    <h3>{building.name}</h3>
                    <p>{building.address}</p>
                    <h2 className="text-warning">
                      ₹{building.offer ? building.discountedPrice : building.regularPrice}
                      {building.type === "rent" && "/mo"}
                    </h2>
                    <div className="d-flex justify-content-between gap-3">
                      <Button variant="light" as={Link} to={`/building-details/${building._id}`}>
                        Details
                      </Button>
                      <Button variant="danger" as={Link} to={`/checkout/${building._id}`}>
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>

          <Row>
            <Col xs={12} md={6} className="mb-4">
              <Link to="/category/rent" style={{ textDecoration: "none", color: "inherit" }}>
                <Card className="border-0">
                  <div style={{ overflow: "hidden", height: "300px" }}>
                    <Card.Img
                      variant="top"
                      src={rentCategoryImage}
                      className="w-100 h-100 object-fit-cover rounded"
                    />
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title className="fw-semibold">Places for rent</Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            </Col>

            <Col xs={12} md={6} className="mb-4">
              <Link to="/category/sale" style={{ textDecoration: "none", color: "inherit" }}>
                <Card className="border-0">
                  <div style={{ overflow: "hidden", height: "300px" }}>
                    <Card.Img
                      variant="top"
                      src={sellCategoryImage}
                      className="w-100 h-100 object-fit-cover rounded"
                    />
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title className="fw-semibold">Places for sale</Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Explore;
