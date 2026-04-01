import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../../Slices/authSlices';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(setCredentials(data));
        navigate('/');
      } else {
        alert(data.message || 'Invalid Email or Password');
      }
    } catch (err) {
      console.error('Login Error:', err);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={5}>
          <Card className="p-4 shadow-lg border-0" style={{ backgroundColor: '#1e293b', color: 'white' }}>
            <h2 className="text-center mb-4 fw-bold text-primary">Welcome Back</h2>
            <p className="text-center text-secondary small">Login to access your library</p>
            
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="name@example.com" 
                  className="bg-dark text-white border-secondary"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Enter password" 
                  className="bg-dark text-white border-secondary"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 py-2 fw-bold shadow-sm">
                Sign In
              </Button>
            </Form>

            <div className="mt-4 text-center text-secondary small">
              New customer? <Link to="/register" className="text-primary text-decoration-none fw-bold">Create Account</Link>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;