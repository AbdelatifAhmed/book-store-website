import { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setCredentials } from '../../Slices/authSlices';
import { useForm } from 'react-hook-form';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
 const {register ,handleSubmit,formState:{errors}}=useForm()

  const submitHandler = async (data) => {
    try {
      const response = await fetch('api/users/register', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        dispatch(setCredentials(responseData)); 
        navigate('/');
      } else {
        alert(responseData.message || 'Registration Failed');
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
            <Form onSubmit={handleSubmit(data => submitHandler(data))}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                  type="text" placeholder="Enter your name" 
                  {...register('name', { required: 'Name is required' , minLength: { value: 3, message: 'Name must be at least 3 characters' } })}
                />
                <Form.Text className="text-muted small fst-italic">
                  {errors.name && <span className="text-danger">{errors.name.message}</span>}
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control 
                  type="email" placeholder="Enter email" 
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                />
                <Form.Text className="text-muted small fst-italic">
                  {errors.email && <span className="text-danger">{errors.email.message}</span>}
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" placeholder="Enter password" 
                  {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
                />
                <Form.Text className="text-muted small fst-italic">
                  {errors.password && <span className="text-danger">{errors.password.message}</span>}
                </Form.Text>
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