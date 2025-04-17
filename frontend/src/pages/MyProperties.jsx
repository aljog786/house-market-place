// frontend/src/pages/MyProperties.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Row, Container, Spinner, Card, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BuildingItem from "../components/BuildingItem";
import {
  useGetBuildingsQuery,
  useDeleteBuildingMutation,
} from "../slices/buildingsApiSlice";

const MyProperties = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // fetch all buildings
  const {
    data: buildingsData = [],
    isLoading,
    isError,
    error,
  } = useGetBuildingsQuery();

  // only this user's listings
  const myBuildings = userInfo
    ? buildingsData.filter((b) => b.userRef && b.userRef._id === userInfo._id)
    : [];

  // delete mutation
  const [deleteBuilding, { isLoading: isDeleting }] =
    useDeleteBuildingMutation();

  const handleEdit = (id) => {
    navigate(`/profile/edit-building/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteBuilding(id).unwrap();
      } catch (err) {
        console.error("Failed to delete property:", err);
      }
    }
  };

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
                  {myBuildings.map((b) => (
                    <BuildingItem
                      key={b._id}
                      id={b._id}
                      building={b}
                      showActions={true}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isDeleting={isDeleting}
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
