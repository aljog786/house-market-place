import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../slices/authSlice';
import { FaHeart } from "react-icons/fa";
import { Button } from "react-bootstrap";

const WishlistButton = ({id}) => {
    const dispatch = useDispatch();
  const favorites = useSelector((state) => state.auth.favorites);
  const isFavorite = favorites.includes(id);

  const handleFavoriteToggle = () => {
    dispatch(toggleFavorite(id));
  };
  return (
    <Button
      variant="light"
      className="position-absolute top-0 z-3 end-0 m-2 p-2 border-0 rounded-circle"
      onClick={handleFavoriteToggle}
    >
      <FaHeart size={20} className={isFavorite ? "text-danger" : "text-secondary"} />
    </Button>
  )
}
export default WishlistButton