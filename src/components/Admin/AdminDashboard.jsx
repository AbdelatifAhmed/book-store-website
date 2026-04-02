import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Row, Col, Card, Badge, Spinner, Tabs, Tab } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useSelector((state) => state.auth);

    const fetchData = async () => {
        setLoading(true);
        try {
            const resBooks = await fetch('http://localhost:5000/api/books', {
                headers: { 'Authorization': `Bearer ${userInfo?.token}` },
            });
            const dataBooks = await resBooks.json();
            setBooks(dataBooks);

            const resOrders = await fetch('http://localhost:5000/api/orders/all', {
                headers: { 'Authorization': `Bearer ${userInfo?.token}` },
            });
            const dataOrders = await resOrders.json();
            setOrders(dataOrders);

            const resUsers = await fetch('http://localhost:5000/api/users/all', {
                headers: { 'Authorization': `Bearer ${userInfo?.token}` },
            });
            const dataUsers = await resUsers.json();
            console.log(dataUsers);
            
            setUsers(dataUsers);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            await fetch(`http://localhost:5000/api/books/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${userInfo?.token}` },
            });
            fetchData();
        }
    };

    const handleReturnBook = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}/return`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${userInfo?.token}`,
                },
            });

            if (response.ok) {
                alert("Book returned to inventory!");
                fetchData();
            }
        } catch (error) {
            console.error("Return operation failed:", error);
        }
    };


    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo?.token}`,
                },
                body: JSON.stringify({ status: newStatus.toLowerCase() }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Order has been ${newStatus} successfully!`);
                fetchData();
            } else {
                alert(data.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Update Status Error:", error);
            alert("Server error, please try again later.");
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;

    return (
        <Container className="py-5 text-white">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Admin <span className="text-primary">Management</span></h2>
                <Button as={Link} to="/admin/add-book" variant="primary">+ Add New Book</Button>
            </div>

            <Tabs defaultActiveKey="books" className="mb-4 custom-tabs">
                <Tab eventKey="books" title={`Books (${books.length})`}>
                    <div className="table-responsive bg-dark-soft p-4 rounded-4 shadow-lg border border-secondary">
                        <Table variant="dark" hover align="middle">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Price</th>
                                    <th>Copies</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books?.map((book) => (
                                    <tr key={book._id}>
                                        <td><img src={book.image} alt={book.title} style={{ width: '40px', borderRadius: '5px' }} /></td>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.price} EGP</td>
                                        <td>{book.availableCopies}</td>
                                        <td>
                                            <Button as={Link}
                                                to={`/admin/update-book/${book._id}`}
                                                variant="outline-info"
                                                size="sm"
                                                className="me-2" >Update</Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => deleteHandler(book._id)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Tab>

                <Tab eventKey="orders" title={`Orders (${orders.length})`}>
                    <div className="table-responsive bg-dark-soft p-4 rounded-4 shadow-lg border border-secondary">
                        <Table variant="dark" hover align="middle">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Book</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order.user?.name}</td>
                                        <td>{order.book?.title}</td>
                                        <td><Badge bg="warning">{order.status}</Badge></td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                {order.status?.toLowerCase() === 'pending' && (
                                                    <>
                                                        <Button
                                                            variant="outline-success"
                                                            size="sm"
                                                            className="btn-neon-success shadow-sm"
                                                            onClick={() => handleUpdateStatus(order._id, 'Approved')}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            className="btn-neon-danger shadow-sm"
                                                            onClick={() => handleUpdateStatus(order._id, 'Rejected')}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}

                                                {order.status?.toLowerCase() === 'approved' && !order.isReturned && (
                                                    <Button
                                                        variant="outline-info"
                                                        size="sm"
                                                        className="btn-neon-info shadow-sm"
                                                        onClick={() => handleReturnBook(order._id)}
                                                    >
                                                        Mark as Returned
                                                    </Button>
                                                )}

                                                {(order.status?.toLowerCase() === 'rejected' || order.isReturned) && (
                                                    <Badge className="bg-glass-secondary text-uppercase px-3 py-2">
                                                        {order.isReturned ? "Returned ✅" : "Rejected ❌"}
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Tab>
                <Tab eventKey="users" title={`Users (${users.length})`}>
                    <div className="table-responsive bg-dark-soft p-4 rounded-4 shadow-lg border border-secondary">
                        <Table variant="dark" hover align="middle">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users?.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <Badge bg={user.role === 'admin' ? 'secondary' : 'info'}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Tab>
            </Tabs>
        </Container >
    );
};

export default AdminDashboard;