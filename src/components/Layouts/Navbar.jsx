import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Nav, Navbar, Container, Button, NavDropdown } from 'react-bootstrap';
import { logout } from '../../Slices/authSlices';

const MyNavbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3 shadow-sm sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
          <span className="text-primary">E-</span>Library
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/books">Books Collection</Nav.Link>
          </Nav>

          <Nav className="ms-auto align-items-center">
            {userInfo ? (
              <>
                {/* إذا كان المستخدم Admin يظهر له لينك الداشبورد */}
                {userInfo.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin/dashboard" className="text-warning fw-bold me-3">
                    Admin Panel
                  </Nav.Link>
                )}

                {/* إذا كان مستخدم عادي يظهر له "My Orders" */}
                {userInfo.role === 'user' && (
                  <Nav.Link as={Link} to="/my-orders" className="text-info me-3">
                    My Orders
                  </Nav.Link>
                )}

                <NavDropdown title={<span className="text-white">Welcome, {userInfo.name}</span>} id="username">
                  <NavDropdown.Item as={Link} to="/profile">Profile Settings</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler} className="text-danger">
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Button as={Link} to="/register" variant="primary" className="ms-lg-3 rounded-pill px-4">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;