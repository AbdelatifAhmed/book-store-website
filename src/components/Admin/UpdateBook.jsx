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

  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/books/${id}`,{
            headers: { 'Authorization': `Bearer ${userInfo?.token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setTitle(data.title);
          setAuthor(data.author);
          setCategory(data.category);
          setPrice(data.price);
          setAvailableCopies(data.availableCopies);
          setImage(data.image);
          setDescription(data.description);
        }
      } catch (err) {
        setError("Could not load book data");
      } finally {
        setFetching(false);
      }
    };
    fetchBook();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify({ title, author, category, price, availableCopies, image, description }),
      });

      if (response.ok) {
        navigate('/admin/dashboard');
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;

  return (
    <Container className="py-5 text-white">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="bg-dark-soft p-4 rounded-4 border border-secondary shadow-lg">
            <h3 className="mb-4 text-primary fw-bold">Update Book Info</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control className="bg-dark text-white border-secondary" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Author</Form.Label>
                    <Form.Control className="bg-dark text-white border-secondary" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="number" className="bg-dark text-white border-secondary" value={price} onChange={(e) => setPrice(e.target.value)} required />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control className="bg-dark text-white border-secondary" value={image} onChange={(e) => setImage(e.target.value)} />
              </Form.Group>

              <div className="d-grid mt-4">
                <Button variant="info" type="submit" disabled={loading} className="fw-bold">
                  {loading ? 'Updating...' : 'Save Changes'}
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