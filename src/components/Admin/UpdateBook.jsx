import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateBook = () => {
  const { id } = useParams(); 
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [availableCopies, setAvailableCopies] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/books/${id}`, {
            headers: { 'Authorization': `Bearer ${userInfo?.token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setTitle(data.title || '');
          setAuthor(data.author || '');
          setCategory(data.category || '');
          setPrice(data.price || '');
          setAvailableCopies(data.availableCopies || '');
          setImage(data.image || '');
          setDescription(data.description || '');
        } else {
          setError(data.message || "Failed to fetch book");
        }
      } catch (err) {
        setError("Could not load book data. Please check your connection.");
      } finally {
        setFetching(false);
      }
    };
    fetchBook();
  }, [id, userInfo?.token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify({ 
            title, 
            author, 
            category, 
            price: Number(price), 
            availableCopies: Number(availableCopies), 
            image, 
            description 
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/admin/dashboard'), 1500); 
      } else {
        const data = await response.json();
        setError(data.message || "Update failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Container className="text-center mt-5 p-5"><Spinner animation="border" variant="info" /></Container>;

  return (
    <Container className="py-5 text-white">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="bg-dark-soft p-4 rounded-4 border border-secondary shadow-lg">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-primary fw-bold mb-0">Update Book Info</h3>
                <Button variant="outline-light" size="sm" onClick={() => navigate(-1)}>Back</Button>
            </div>

            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
            {success && <Alert variant="success">Book updated successfully! Redirecting...</Alert>}
            
            <Form onSubmit={submitHandler}>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-secondary">Book Title</Form.Label>
                    <Form.Control 
                        className="bg-dark text-white border-secondary focus-primary" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-secondary">Author</Form.Label>
                    <Form.Control 
                        className="bg-dark text-white border-secondary" 
                        value={author} 
                        onChange={(e) => setAuthor(e.target.value)} 
                        required 
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-secondary">Category</Form.Label>
                    <Form.Control 
                        className="bg-dark text-white border-secondary" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        required 
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-secondary">Price (EGP)</Form.Label>
                    <Form.Control 
                        type="number" 
                        className="bg-dark text-white border-secondary" 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        required 
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-secondary">Available Copies</Form.Label>
                    <Form.Control 
                        type="number" 
                        className="bg-dark text-white border-secondary" 
                        value={availableCopies} 
                        onChange={(e) => setAvailableCopies(e.target.value)} 
                        required 
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-secondary">Image URL</Form.Label>
                    <Form.Control 
                        className="bg-dark text-white border-secondary" 
                        value={image} 
                        onChange={(e) => setImage(e.target.value)} 
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-secondary">Description</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={3}
                        className="bg-dark text-white border-secondary" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid mt-4">
                <Button variant="info" type="submit" disabled={loading} className="fw-bold py-2 shadow-sm text-dark">
                  {loading ? <><Spinner size="sm" className="me-2"/> Saving Changes...</> : 'Save Changes'}
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateBook;