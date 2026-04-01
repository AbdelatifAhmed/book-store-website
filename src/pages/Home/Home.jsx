import { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import BookCard from '../../components/BookCard/BookCard';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const userInfo = useSelector((state) => state.auth.userInfo);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/books', {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(userInfo?.token && { 'Authorization': `Bearer ${userInfo.token}` }),
                    },
                });
                const data = await response.json();
                setBooks(data.slice(0, 4));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching books:", error);
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    return (
        <div className="home-wrapper px-3 py-4">

            {/* --- Section 1: Hero Section --- */}
            <section className="hero-section text-center py-5 mb-5" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '20px' }}>
                <Container>
                    <Row className="align-items-center py-5">
                        <Col lg={12}>
                            <Badge bg="primary" className="mb-3 px-3 py-2">New Collection 2026</Badge>
                            <h1 className="display-3 fw-bold mb-3">Explore the World of <span className="text-primary">Knowledge</span></h1>
                            <p className="lead text-secondary mb-4">Discover thousands of books from world-class authors in our modern digital library.</p>
                            <div className="d-flex justify-content-center gap-3">
                                <Button variant="primary" size="lg" as={Link} to="/books" className="px-5 shadow">Browse Books</Button>
                                <Button variant="outline-light" size="lg" className="px-5">Learn More</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* --- Section 2: Features (Why Us) --- */}
            <section className="features-section py-5">
                <Row className="text-center g-4">
                    <Col md={4}>
                        <div className="p-4 rounded-4 bg-dark-soft border border-secondary shadow-sm h-100">
                            <div className="fs-1 mb-3">🚚</div>
                            <h4>Fast Delivery</h4>
                            <p className="text-secondary">Get your favorite books delivered to your doorstep within 24 hours.</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-4 rounded-4 bg-dark-soft border border-secondary shadow-sm h-100">
                            <div className="fs-1 mb-3">🛡️</div>
                            <h4>Secure Payment</h4>
                            <p className="text-secondary">100% secure payment processing with top-tier encryption.</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-4 rounded-4 bg-dark-soft border border-secondary shadow-sm h-100">
                            <div className="fs-1 mb-3">📖</div>
                            <h4>Best Authors</h4>
                            <p className="text-secondary">Direct access to the most famous international and local authors.</p>
                        </div>
                    </Col>
                </Row>
            </section>

            {/* --- Section 3: Latest Books --- */}
            <section className="latest-books py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold">Latest Arrivals</h2>
                    <Link to="/books" className="text-primary text-decoration-none fw-bold">View All &rarr;</Link>
                </div>

                <Row className="g-4">
                    {loading ? (
                        <p >Loading books...</p>
                    ) : (
                        books.length > 0 ? books.map((book) => (
                            <Col key={book._id} xs={12} md={6} lg={3}>
                                <Container className="">
                                    <BookCard book={book} />
                                </Container>
                            </Col>
                        )) : <>
                            <div className="text-center py-5">
                                <h3>No books available at the moment.</h3>
                                <p className="text-secondary">Please Login to view our collection.</p>
                            </div>
                        </>
                    )}
                </Row>
            </section>

            {/* --- Section 4: Newsletter (Footer Lead) --- */}
            <section className="newsletter-section py-5 my-5 text-center bg-primary rounded-4 text-white">
                <h2 className="fw-bold">Don't Miss Out!</h2>
                <p>Subscribe to our newsletter to get the latest updates and offers.</p>
                <div className="d-flex justify-content-center mt-3">
                    <div className="input-group w-50 shadow-lg">
                        <input type="email" className="form-control rounded-start-pill border-0 px-4" placeholder="Enter your email" />
                        <button className="btn btn-dark rounded-end-pill px-4">Subscribe</button>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;