import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';


const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: 'danger', text: 'Passwords do not match' });
    } else {
      setLoadingUpdate(true);
      try {
        const res = await fetch('http://localhost:5000/api/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (res.ok) {
          setMessage({ type: 'success', text: 'Profile Updated Successfully!' });
        } else {
          setMessage({ type: 'danger', text: data.message });
        }
      } catch (err) {
        setMessage({ type: 'danger', text: 'Server Error' });
      } finally {
        setLoadingUpdate(false);
      }
    }
  };

  return (
    <Container className="py-5 text-white">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="bg-dark-soft p-4 rounded-4 border border-secondary shadow-lg">
            <div className="text-center mb-4">
              <div className="avatar-placeholder mb-3">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                  {name.charAt(0).toUpperCase()}
                </div>
              </div>
              <h3 className="fw-bold text-primary">User Profile</h3>
              <Badge bg="info" className="px-3 py-2 mt-2">{userInfo?.role?.toUpperCase()}</Badge>
            </div>

            {message && <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>{message.text}</Alert>}

            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label className="text-secondary">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label className="text-secondary">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>

              <hr className="my-4 border-secondary" />
              <p className="text-info small mb-3">Leave password fields blank to keep current password</p>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label className="text-secondary">New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="confirmPassword">
                <Form.Label className="text-secondary">Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button variant="primary" type="submit" className="fw-bold py-2 rounded-pill shadow" disabled={loadingUpdate}>
                  {loadingUpdate ? <Spinner size="sm" /> : 'Update Profile'}
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;