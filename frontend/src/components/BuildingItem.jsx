import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";
import { FaBed, FaBath } from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import WishlistButton from "./WishlistButton";
import { useDeleteBuildingMutation } from "../slices/buildingsApiSlice";
import "./BuildingItem.css";

const BuildingItem = memo(({ building, id }) => {
  const navigate = useNavigate();

  const {
    imageUrls,
    address,
    name,
    offer,
    discountedPrice,
    regularPrice,
    type,
    rooms,
    toilets,
    userRef
  } = building;

  const currentUserId = useSelector((state) => state.auth.userInfo?._id);

  const [deleteBuilding, { isLoading: isDeleting }] =
    useDeleteBuildingMutation();

  const handleEdit = () => {
    navigate(`/profile/edit-building/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteBuilding(id).unwrap();
      } catch (error) {
        console.error("Failed to delete property", error);
      }
    }
  };

  return (
    <Col xs={12} sm={6} lg={4} xl={3} className="mb-4">
      <Card className="h-100 card-hover border-0 shadow-sm overflow-hidden">
        <WishlistButton id={id} />
        <Link to={`/building-details/${id}`} className="text-decoration-none">
          <div className="ratio ratio-16x9">
            <Card.Img
              variant="top"
              src={imageUrls[0]}
              alt={name}
              loading="lazy"
              className="object-fit-cover"
            />
          </div>
        </Link>
        <Card.Body className="d-flex flex-column pt-3">
          <div className="mb-2">
            {offer && (
              <Badge pill bg="danger" className="mb-2">
                {Math.round(
                  ((regularPrice - discountedPrice) / regularPrice) * 100
                )}
                % Off
              </Badge>
            )}
            <Card.Title
              className="fs-6 fw-bold text-dark truncate-2-lines"
              title={name}
            >
              {name}
            </Card.Title>
            <Card.Text
              className="text-muted small truncate-1-line"
              title={address}
            >
              {address}
            </Card.Text>
          </div>
          <div className="mt-auto">
            <div className="d-flex align-items-center gap-2 mb-2">
              <RiMoneyRupeeCircleFill className="text-success" />
              <span className="fs-5 fw-bold text-success">
                {(offer ? discountedPrice : regularPrice).toLocaleString()}
              </span>
              {offer && (
                <del className="small text-muted">
                  ₹{regularPrice.toLocaleString()}
                </del>
              )}
              <span className="small text-muted ms-auto">
                {type === "rent" ? "/month" : ""}
              </span>
            </div>
            <hr className="my-2" />
            <Row className="g-2 text-center small">
              <Col>
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <FaBed className="text-primary" /> {rooms} Beds
                </div>
              </Col>
              <Col>
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <FaBath className="text-info" /> {toilets} Baths
                </div>
              </Col>
            </Row>
            {currentUserId === userRef?._id && (
              <>
                <Button
                  variant="secondary"
                  className="mt-3 w-100 fw-bold"
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  className="mt-2 w-100 fw-bold"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
});

export default BuildingItem;
