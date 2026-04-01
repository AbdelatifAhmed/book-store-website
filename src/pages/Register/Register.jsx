import { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setCredentials } from '../../Slices/authSlices';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('api/users/register', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(setCredentials(data)); 
        navigate('/');
      } else {
        alert(data.message || 'Registration Failed');
      }
    } catch (err) {
      console.error('Register Error:', err);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={5}>
          <Card className="p-4 shadow">
            <h2 className="text-center mb-4">Create Account</h2>
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                  type="text" placeholder="Enter your name" 
                  value={name} onChange={(e) => setName(e.target.value)} required 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control 
                  type="email" placeholder="Enter email" 
                  value={email} onChange={(e) => setEmail(e.target.value)} required 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" placeholder="Enter password" 
                  value={password} onChange={(e) => setPassword(e.target.value)} required 
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-3">
                Register
              </Button>
            </Form>
            <div className="mt-3 text-center">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;