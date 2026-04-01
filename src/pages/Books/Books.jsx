import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import BookCard from '../../components/BookCard/BookCard';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/books', {
          headers: {
            'Authorization': `Bearer ${userInfo?.token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok) {
          setBooks(data);
        } else {
          setError(data.message || 'Failed to fetch books');
        }
      } catch (err) {
        setError('Server Error: Connection failed');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchBooks();
    } else {
      setLoading(false);
      setError('Please login to view our collection');
    }
  }, [userInfo]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-secondary">Loading your library...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold text-white border-bottom border-primary border-3 pb-2">
          Our Collection
        </h2>
        <Badge bg="primary" className="p-2 px-3">{books.length} Books Available</Badge>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4">
        {books.map((book) => (
          <Col key={book._id} xs={12} sm={6} lg={3}>
            <BookCard book={book} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Books;