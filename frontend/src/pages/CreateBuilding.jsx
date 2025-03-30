import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  Button, 
  Form, 
  Col, 
  Row, 
  Container, 
  ToggleButton, 
  FloatingLabel,
  Card,
  ProgressBar,
  Stack
} from 'react-bootstrap';
import { FaUpload } from 'react-icons/fa';
import { useCreateBuildingMutation, useUploadBuildingImageMutation } from '../slices/buildingsApiSlice';

const CreateBuilding = () => {
  const [formData, setFormData] = useState({
    type: 'sale',
    name: '',
    rooms: 1,
    toilets: 1,
    parking: true,
    furnished: true,
    address: '',
    regularPrice: '',
    offer: false,
    discountedPrice: '',
  });
  const [images, setImages] = useState([]);
  const [uploadProgress] = useState(0);

  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [createBuilding, { isLoading }] = useCreateBuildingMutation();
  const [uploadBuildingImage] = useUploadBuildingImageMutation();

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const uploadImageHandler = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 3) {
      toast.error('Maximum 3 images allowed');
      return;
    }

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        
        const res = await uploadBuildingImage(formData).unwrap();
        return res.image;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedImages]);
      toast.success('Images uploaded successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Image upload failed');
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (images.length === 0) return 'At least one image is required';
    if (formData.offer && formData.discountedPrice >= formData.regularPrice) {
      return 'Discounted price must be less than regular price';
    }
    return null;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return toast.error(validationError);

    try {
      await createBuilding({
        ...formData,
        imageUrls: images,
        regularPrice: Number(formData.regularPrice),
        discountedPrice: formData.offer ? Number(formData.discountedPrice) : 0,
      }).unwrap();
      
      toast.success('Building created successfully');
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create building');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xl={9} lg={10} md={12}>
          <Card className="shadow-lg">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4 fw-bold text-success">
                List New Property
              </h2>
              
              <Form onSubmit={submitHandler}>
                {/* Type Toggle */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Transaction Type</Form.Label>
                  <div className="d-grid gap-2 d-md-flex">
                    <ToggleButton
                      type="radio"
                      variant="outline-success"
                      id="type-sale"
                      value="sale"
                      checked={formData.type === 'sale'}
                      onChange={() => handleInputChange('type', 'sale')}
                    >
                      For Sale
                    </ToggleButton>
                    <ToggleButton
                      type="radio"
                      variant="outline-success"
                      id="type-rent"
                      value="rent"
                      checked={formData.type === 'rent'}
                      onChange={() => handleInputChange('type', 'rent')}
                    >
                      For Rent
                    </ToggleButton>
                  </div>
                </Form.Group>

                {/* Property Details */}
                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <FloatingLabel label="Property Name">
                      <Form.Control
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        placeholder="Property Name"
                      />
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel label={`${formData.type === 'rent' ? 'Monthly' : ''} Price (₹)`}>
                      <Form.Control
                        type="number"
                        value={formData.regularPrice}
                        onChange={(e) => handleInputChange('regularPrice', e.target.value)}
                        min="1"
                        required
                        placeholder="Price"
                      />
                    </FloatingLabel>
                  </Col>
                </Row>

                {/* Specifications */}
                <Row className="g-3 mb-4">
                  <Col md={4}>
                    <FloatingLabel label="Bedrooms">
                      <Form.Control
                        type="number"
                        value={formData.rooms}
                        onChange={(e) => handleInputChange('rooms', e.target.value)}
                        min="1"
                        required
                      />
                    </FloatingLabel>
                  </Col>
                  <Col md={4}>
                    <FloatingLabel label="Bathrooms">
                      <Form.Control
                        type="number"
                        value={formData.toilets}
                        onChange={(e) => handleInputChange('toilets', e.target.value)}
                        min="1"
                        required
                      />
                    </FloatingLabel>
                  </Col>
                  <Col md={4}>
                    <FloatingLabel label="Address">
                      <Form.Control
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        required
                      />
                    </FloatingLabel>
                  </Col>
                </Row>

                {/* Amenities */}
                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Amenities</Form.Label>
                      <Stack gap={2}>
                        <Form.Check 
                          type="switch"
                          label="Parking Available"
                          checked={formData.parking}
                          onChange={(e) => handleInputChange('parking', e.target.checked)}
                        />
                        <Form.Check 
                          type="switch"
                          label="Fully Furnished"
                          checked={formData.furnished}
                          onChange={(e) => handleInputChange('furnished', e.target.checked)}
                        />
                      </Stack>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Special Offer</Form.Label>
                      <Stack gap={2}>
                        <Form.Check 
                          type="switch"
                          label="Enable Discount"
                          checked={formData.offer}
                          onChange={(e) => handleInputChange('offer', e.target.checked)}
                        />
                        {formData.offer && (
                          <FloatingLabel label="Discounted Price ($)">
                            <Form.Control
                              type="number"
                              value={formData.discountedPrice}
                              onChange={(e) => handleInputChange('discountedPrice', e.target.value)}
                              min="1"
                              required={formData.offer}
                            />
                          </FloatingLabel>
                        )}
                      </Stack>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Image Upload */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold d-block">Property Images</Form.Label>
                  <Form.Text className="d-block mb-2">Upload up to 3 images (JPEG/PNG/JPG)</Form.Text>
                  
                  <div className="border rounded-3 p-3 bg-light">
                    <Row className="g-3">
                      {images.map((img, index) => (
                        <Col key={index} xs={6} md={4}>
                          <Card className="h-100">
                            <Card.Img variant="top" src={img} />
                            <Button
                              variant="danger"
                              size="sm"
                              className="position-absolute top-0 end-0 m-1"
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </Button>
                          </Card>
                        </Col>
                      ))}
                      
                      {images.length < 3 && (
                        <Col xs={6} md={4}>
                          <label 
                            htmlFor="image-upload" 
                            className="d-flex align-items-center justify-content-center h-100 cursor-pointer"
                            style={{ 
                              minHeight: '100px',
                              border: '2px dashed #dee2e6',
                              borderRadius: '0.375rem'
                            }}
                          >
                            <div className="text-center">
                              <FaUpload className="fs-4 mb-2 text-muted" />
                              <div className="text-muted small">Click to upload</div>
                            </div>
                          </label>
                          <Form.Control
                            type="file"
                            id="image-upload"
                            onChange={uploadImageHandler}
                            accept="image/*"
                            multiple
                            hidden
                          />
                        </Col>
                      )}
                    </Row>
                    
                    {uploadProgress > 0 && (
                      <ProgressBar 
                        now={uploadProgress} 
                        label={`${uploadProgress}%`} 
                        className="mt-3"
                      />
                    )}
                  </div>
                </Form.Group>

                <div className="d-grid mt-4">
                  <Button 
                    variant="success" 
                    size="lg"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Publishing...' : 'Publish Listing'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateBuilding;