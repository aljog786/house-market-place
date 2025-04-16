import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCart } from "../slices/cartSlice";
import {
  useGetUserCartQuery,
  useRemoveFromCartMutation,
} from "../slices/usersApiSlice";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const Cart = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userInfo?._id);
  const { data: cartItems = [], refetch } = useGetUserCartQuery(userId, {
    skip: !userId,
  });
  const [removeFromCart] = useRemoveFromCartMutation();

  useEffect(() => {
    dispatch(setCart(cartItems));
  }, [cartItems, dispatch]);

  const handleRemove = async (buildingId) => {
    await removeFromCart({ userId, buildingId });
    refetch();
  };

  const totalAmount = cartItems.reduce((sum, building) => {
    const price = building.offer
      ? building.discountedPrice
      : building.regularPrice;
    return sum + price;
  }, 0);

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg p-4">
            <h2 className="mb-4">Your Cart</h2>

            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((building) => (
                <Card className="mb-3" key={building._id}>
                  <Card.Body>
                    <Row className="mb-4">
                      <Col md={6}>
                        <h5>{building.name}</h5>
                        <p className="text-muted">{building.address}</p>
                        <p>
                          Price: ₹
                          {building.offer
                            ? building.discountedPrice
                            : building.regularPrice}
                          {building.type === "rent" && "/month"}
                        </p>
                      </Col>
                      <Col md={6}>
                        <img
                          src={building.imageUrls[0]}
                          alt={building.name}
                          className="img-fluid rounded"
                        />
                      </Col>
                    </Row>
                    <div className="border-top pt-3 d-flex justify-content-between">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemove(building._id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}

            {cartItems.length > 0 && (
              <>
                <div className="border-top pt-3 mb-3 d-flex justify-content-between align-items-center">
                  <h5>Total:</h5>
                  <h5>
                    ₹{totalAmount}
                    {/* optionally add "/month" if rent-only cart */}
                  </h5>
                </div>

                <div className="text-center">
                  <Link to="/payment" state={{ totalAmount }}>
                    <Button variant="success" size="lg" className="mt-3">
                      Confirm Payment
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
