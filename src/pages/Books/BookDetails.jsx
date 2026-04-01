import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      const res = await fetch(`http://localhost:5000/api/books/${id}`,{
        headers: { 'Authorization': `Bearer ${userInfo?.token}` },
      });
      const data = await res.json();
      setBook(data);
      setLoading(false);
    };
    fetchBook();
  }, [id]);

  const handleOrder = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    setOrderLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ bookId: book._id }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Order placed successfully! Redirecting to your orders...' });
        setTimeout(() => navigate('/my-orders'), 2000);
      } else {
        setMessage({ type: 'danger', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: 'Server error' });
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <Container className="py-5 text-white">
      {message && <Alert variant={message.type}>{message.text}</Alert>}
      <Row className="align-items-center">
        <Col md={5}>
          <img src={book.image} alt={book.title} className="img-fluid rounded-4 shadow-lg w-100" style={{ maxHeight: '500px', objectFit: 'cover' }} />
        </Col>
        <Col md={7} className="ps-md-5 mt-4 mt-md-0">
          <Badge bg="primary" className="mb-2">{book.category}</Badge>
          <h1 className="fw-bold mb-3">{book.title}</h1>
          <h4 className="text-secondary mb-4">By {book.author}</h4>
          <p className="lead text-light mb-4">{book.description || "No description available for this book."}</p>
          
          <div className="d-flex align-items-center mb-4 gap-3">
            <h2 className="text-info fw-bold mb-0">{book.price} EGP</h2>
            <Badge bg={book.availableCopies > 0 ? "success" : "danger"}>
              {book.availableCopies > 0 ? `${book.availableCopies} Copies Available` : "Out of Stock"}
            </Badge>
          </div>

          <Button 
            variant="primary" 
            size="lg" 
            className="px-5 py-3 fw-bold rounded-pill" 
            onClick={handleOrder}
            disabled={book.availableCopies === 0 || orderLoading}
          >
            {orderLoading ? <Spinner size="sm" /> : 'Rent This Book Now'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default BookDetails;