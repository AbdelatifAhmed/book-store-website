import { useEffect, useState } from 'react';
import { Badge, Container, Spinner, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders/myorders', {
          headers: { 'Authorization': `Bearer ${userInfo?.token}` },
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [userInfo]);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <Container className="py-5 text-white">
      <h2 className="fw-bold mb-4">My <span className="text-primary">Order History</span></h2>
      <div className="table-responsive bg-dark-soft p-4 rounded-4 border border-secondary shadow">
        <Table variant="dark" hover align="middle">
          <thead>
            <tr>
              <th>Date</th>
              <th>Book Title</th>
              <th>Status</th>
              <th>Returned</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.book?.title}</td>
                <td>
                  <Badge bg={order.status === 'Approved' ? 'success' : order.status === 'Rejected' ? 'danger' : 'warning'}>
                    {order.status}
                  </Badge>
                </td>
                <td>{order.isReturned ? '✅ Yes' : '❌ No'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default MyOrders;