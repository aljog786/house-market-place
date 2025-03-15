import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Form, Col, Row, Container, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { useCreateBuildingMutation,useUploadBuildingImageMutation } from '../slices/buildingsApiSlice';

const CreateBuilding = () => {

  const [type, setType] = useState(true);
  const [name, setName] = useState('');
  const [rooms, setRooms] = useState('0');
  const [toilets, setToilets] = useState('0');
  const [parking, setParking] = useState(true);
  const [furnished, setFurnished] = useState(true);
  const [address, setAddress] = useState('');
  const [regularPrice, setRegularPrice] = useState('0');
  const [offer, setOffer] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [image, setImage] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  console.log(userInfo);
  const navigate = useNavigate();
  const [createBuilding, { isLoading }] = useCreateBuildingMutation();
  const [uploadBuildingImage] = useUploadBuildingImageMutation();

  const uploadImageHandler = async (e) => {
    const formData = new FormData();
        formData.append('image', e.target.files[0]);
        try {
            const res = await uploadBuildingImage(formData).unwrap();
            toast.success('Image added');
            setImage(res.image);
        } catch (err) {
            toast.error(err?.data?.message || err.message);
        }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
try {
    const createdBuilding = {
      name,
      type: type ? 'sale' : 'rent',
      rooms: Number(rooms),
      toilets: Number(toilets),
      parking,
      furnished,
      address,
      regularPrice: Number(regularPrice),
      offer,
      discountedPrice: offer ? Number(discountedPrice) : 0,
      imageUrls: [image]
    };
    console.log(createdBuilding);
    // Send Building data to backend
    await createBuilding(createdBuilding).unwrap();
    toast.success('Building created successfully');
    navigate('/buildings');
} catch (err) {
    toast.error(err?.data?.message || err.message || 'Failed to create building');
}
};

  return (
    <Container className='mb-5'>
      <h2 className="mt-4 mb-4" style={{ fontWeight: 'bold' }}>Create a Building</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3">Sell / Rent</Form.Label>
          <Col sm="9">
            <ToggleButtonGroup type="radio" name="type" defaultValue={type} className="d-flex">
              <ToggleButton
                variant={type ? 'success' : 'outline-success'}
                id="type-sale"
                value={true}
                onChange={(e) => setType(true)}
              >
                Sell
              </ToggleButton>
              <ToggleButton
                variant={!type ? 'success' : 'outline-success'}
                id="type-rent"
                value={false}
                onChange={(e) => setType(false)}
              >
                Rent
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            id="name"
            value={name}
            maxLength="32"
            minLength="6"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Bedrooms</Form.Label>
              <Form.Control
                type="number"
                id="rooms"
                value={rooms}
                min="1"
                max="50"
                required
            onChange={(e) => setRooms(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Toilets</Form.Label>
              <Form.Control
                type="number"
                id="toilets"
                value={toilets}
                onChange={(e) => setToilets(e.target.value)}
                min="1"
                required
              />
            </Form.Group>
          </Col>
        </Row>



        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3">Parking Spot</Form.Label>
          <Col sm="9">
            <ToggleButtonGroup type="radio" name="parking" defaultValue={parking} className="d-flex">
              <ToggleButton
                variant={parking ? 'success' : 'outline-success'}
                id="parking-yes"
                value={true}
                onChange={(e) => setParking(true)}
              >
                Yes
              </ToggleButton>
              <ToggleButton
                variant={!parking ? 'success' : 'outline-success'}
                id="parking-no"
                value={false}
                onChange={(e) => setParking(false)}
              >
                No
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3">Furnished</Form.Label>
          <Col sm="9">
            <ToggleButtonGroup type="radio" name="furnished" defaultValue={furnished} className="d-flex">
              <ToggleButton
                variant={furnished ? 'success' : 'outline-success'}
                id="furnished-yes"
                value={true}
                onChange={(e) => setFurnished(true)}
              >
                Yes
              </ToggleButton>
              <ToggleButton
                variant={!furnished ? 'success' : 'outline-success'}
                id="furnished-no"
                value={false}
                onChange={(e) => setFurnished(false)}
              >
                No
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Regular Price</Form.Label>
          <Form.Control
            type="number"
            id="regularPrice"
            value={regularPrice}
            onChange={(e) => setRegularPrice(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3">Offer</Form.Label>
          <Col sm="9">
            <ToggleButtonGroup type="radio" name="offer" defaultValue={offer} className="d-flex">
              <ToggleButton
                variant={offer ? 'success' : 'outline-success'}
                id="offer-yes"
                value={true}
                onChange={(e) => setOffer(true)}
              >
                Yes
              </ToggleButton>
              <ToggleButton
                variant={!offer ? 'success' : 'outline-success'}
                id="offer-no"
                value={false}
                onChange={(e) => setOffer(false)}
              >
                No
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Form.Group>

        {offer && (
          <Form.Group className="mb-3">
            <Form.Label>Discounted Price</Form.Label>
            <Form.Control
              type="number"
              id="discountedPrice"
              value={discountedPrice}
              onChange={(e) => setDiscountedPrice(e.target.value)}
              required={offer}
            />
          </Form.Group>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            id="images"
            onChange={uploadImageHandler}
            accept=".jpg,.png,.jpeg"
            required
          />
          <Form.Text className="text-muted">
            The first image will be the cover (max 3).
          </Form.Text>
        </Form.Group>

        <Button className='w-100 mt-4 mb-4' type="submit" variant="success">
        {isLoading ? 'Creating...' : 'Create'}
        </Button>
      </Form>
    </Container>
  );
}

export default CreateBuilding;