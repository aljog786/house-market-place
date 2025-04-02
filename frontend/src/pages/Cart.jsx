import { useSelector, useDispatch } from 'react-redux'; 
import { removeFromCart } from '../slices/cartSlice'; // Import the remove action
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Cart = () => {
  const dispatch = useDispatch(); // Initialize dispatch
  const cartItems = useSelector((state) => state.cart.cartItems);

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
                <Card className="mb-3" key={building._id}> {/* Added unique key */}
                  <Card.Body>
                    <Row className="mb-4">
                      <Col md={6}>
                        <h5>{building.name}</h5>
                        <p className="text-muted">{building.address}</p>
                        <p>
                          Price: ₹{building.offer ? building.discountedPrice : building.regularPrice}
                          {building.type === 'rent' && '/month'}
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
                        onClick={() => dispatch(removeFromCart(building._id))} // Remove item on click
                      >
                        Remove
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
            {cartItems.length > 0 && (
              <div className="border-top pt-4 text-center">
                <Button 
                  variant="success" 
                  size="lg"
                  className="mt-3"
                >
                  Confirm Payment
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
