import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    return (
        <Card className="h-100 border-0 shadow book-card-hover" style={{ backgroundColor: '#1e293b' }}>
            <div className="position-relative overflow-hidden">
                <Card.Img
                    variant="top"
                    src={book.image || "https://img.freepik.com/free-vector/vector-blank-book-cover-isolated-white_1284-41904.jpg?semt=ais_incoming&w=740&q=80"}
                    style={{ height: '350px', objectFit: 'cover', transition: '0.3s' }}
                    className="card-img-zoom"
                />
            </div>
            <Card.Body className="d-flex flex-column text-white">
                <Card.Title className="fs-5 fw-bold mb-1">{book.title}</Card.Title>
                <Card.Text className="text-secondary small mb-3">By {book.author}</Card.Text>

                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="fw-bold fs-5 text-info">{book.price} EGP</span>
                    <Button
                        as={Link}
                        to={`/books/${book._id}`}
                        variant="outline-primary"
                        size="sm"
                        className="rounded-pill px-3"
                    >
                        Details
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default BookCard;