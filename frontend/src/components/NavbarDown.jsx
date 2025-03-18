import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdExplore } from 'react-icons/md';
import { BiSolidOffer } from 'react-icons/bi';
import { IoPerson } from 'react-icons/io5';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { logout } from '../slices/authSlice';
import './NavbarDown.css';

const NavbarDown = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatchRoute = (route) => route === location.pathname;

  const handleProfileClick = () => {
    if (userInfo) {
      navigate(`/profile/${userInfo._id}`);
    } else {
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <Navbar fixed="bottom" bg="light" className="border-top">
      <Nav className="w-100 justify-content-around">
        <Nav.Item onClick={() => navigate("/")} className="text-center">
          <MdExplore color={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'} size={25} />
          <p>Explore</p>
        </Nav.Item>
        <Nav.Item onClick={() => navigate("/offers")} className="text-center">
          <BiSolidOffer color={pathMatchRoute('/offers') ? '#2c2c2c' : '#8f8f8f'} size={25} />
          <p>Offers</p>
        </Nav.Item>
        <Nav.Item onClick={handleProfileClick} className="text-center">
          <IoPerson color={userInfo && pathMatchRoute(`/profile/${userInfo?._id}`) ? '#2c2c2c' : '#8f8f8f'} size={25} />
          <p>{userInfo ? userInfo.name : 'Profile'}</p>
        </Nav.Item>
      </Nav> 
    </Navbar>
  );
};

export default NavbarDown;
