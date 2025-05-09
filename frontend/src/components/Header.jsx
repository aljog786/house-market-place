import { Container, Image, Badge } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdFavorite } from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";
import { BiSolidMessageDetail } from "react-icons/bi";
import { LuCirclePower } from "react-icons/lu";
import { logout } from "../slices/authSlice";
import logo from "../assets/png/Logo.png";
import { useGetUserFavoritesQuery,useGetUserCartQuery } from "../slices/usersApiSlice";  // Import API hook

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: favorites, isLoading, isError } = useGetUserFavoritesQuery(userInfo?._id, {
    skip: !userInfo, // Skip query if user is not logged in
  });
  const favoritesCount = favorites?.length || 0;

  const { data: cart, isLoading: isCartLoading, isError: isCartError } = useGetUserCartQuery(userInfo?._id, {
    skip: !userInfo,
  });
  const cartCount = cart?.length || 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Container className="d-flex justify-content-between p-3">
      <div className="d-flex align-items-center">
        <Image src={logo} alt="Logo" className="img-fluid rounded" style={{ maxWidth: "100px", height: "auto" }} />
        <h2 className="text-primary ms-3 mb-0">House Market Place</h2>
      </div>

      {userInfo && (
        <div className="d-flex align-items-center">
        <div className="position-relative me-3" onClick={() => navigate("/profile/chats")} style={{ cursor: "pointer" }}>
            <BiSolidMessageDetail className="text-info" size={24} />
            {!isLoading && !isError && favoritesCount > 0 && (
              <Badge pill bg="warning" className="position-absolute" style={{ top: "-8px", right: "-8px", fontSize: "0.7rem" }}>
                {cartCount}
              </Badge>
            )}
          </div>
          <div className="position-relative me-3" onClick={() => navigate("/cart")} style={{ cursor: "pointer" }}>
            <FaCartShopping className="text-secondary" size={24} />
            {!isLoading && !isError && favoritesCount > 0 && (
              <Badge pill bg="warning" className="position-absolute" style={{ top: "-8px", right: "-8px", fontSize: "0.7rem" }}>
                {cartCount}
              </Badge>
            )}
          </div>
          <div className="position-relative me-3" onClick={() => navigate("/profile/favorites")} style={{ cursor: "pointer" }}>
            <MdFavorite className="text-danger" size={24} />
            {!isLoading && !isError && favoritesCount > 0 && (
              <Badge pill bg="warning" className="position-absolute" style={{ top: "-8px", right: "-8px", fontSize: "0.7rem" }}>
                {favoritesCount}
              </Badge>
            )}
          </div>
          <LuCirclePower className="text-danger" size={24} onClick={handleLogout} style={{ cursor: "pointer" }} />
        </div>
      )}
    </Container>
  );
};

export default Header;