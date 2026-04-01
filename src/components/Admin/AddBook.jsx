import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [availableCopies, setAvailableCopies] = useState('');
  const [image, setImage] = useState(''); 
  const [description, setDescription] = useState(''); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const bookData = {
      title,
      author,
      category,
      price: Number(price),
      availableCopies: Number(availableCopies),
      image,
      description,
    };

    try {
      const response = await fetch('http://localhost:5000/api/books/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify(bookData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTitle(''); setAuthor(''); setCategory(''); setPrice(''); setAvailableCopies(''); setImage(''); setDescription('');
        setTimeout(() => navigate('/admin/dashboard'), 2000);
      } else {
        setError(data.message || 'Failed to create book');
      }
    } catch (err) {
      setError('Server Error: Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 text-white">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="bg-dark-soft p-4 rounded-4 shadow-lg border border-secondary">
            <h3 className="mb-4 fw-bold text-center text-primary">Add New Book Collection</h3>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Book created successfully! Redirecting...</Alert>}

            <Form onSubmit={submitHandler}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="title">
                    <Form.Label>Book Title</Form.Label>
                    <Form.Control type="text" placeholder="e.g. Clean Code" className="bg-dark text-white border-secondary" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="author">
                    <Form.Label>Author Name</Form.Label>
                    <Form.Control type="text" placeholder="e.g. Robert C. Martin" className="bg-dark text-white border-secondary" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control type="text" placeholder="e.g. Programming, Fiction" className="bg-dark text-white border-secondary" value={category} onChange={(e) => setCategory(e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3" controlId="price">
                    <Form.Label>Price (EGP)</Form.Label>
                    <Form.Control type="number" placeholder="450" className="bg-dark text-white border-secondary" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3" controlId="copies">
                    <Form.Label>Copies</Form.Label>
                    <Form.Control type="number" placeholder="10" className="bg-dark text-white border-secondary" value={availableCopies} onChange={(e) => setAvailableCopies(e.target.value)} required min="0" />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="image">
                <Form.Label>Book Cover Image URL</Form.Label>
                <Form.Control type="url" placeholder="https://example.com/image.jpg" className="bg-dark text-white border-secondary" value={image} onChange={(e) => setImage(e.target.value)} />
                <Form.Text className="text-muted">Direct link to the book cover image.</Form.Text>
              </Form.Group>

              <Form.Group className="mb-4" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Brief about the book..." className="bg-dark text-white border-secondary" value={description} onChange={(e) => setDescription(e.target.value)} />
              </Form.Group>

              <div className="d-grid mt-4">
                <Button variant="primary" type="submit" size="lg" disabled={loading} className="fw-bold shadow">
                  {loading ? <Spinner animation="border" size="sm" /> : 'Create Book'}
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddBook;