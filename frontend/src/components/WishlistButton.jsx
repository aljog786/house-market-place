import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../slices/authSlice';
import { FaHeart } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

const WishlistButton = ({ id }) => {
  const dispatch = useDispatch();
  const [favoritesList, setFavoritesList] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);

  const isFavorite = favoritesList.includes(id);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userInfo?._id) {
        setFavoritesList([]);
        return;
      }

      try {
        const { data } = await axios.get(`${BASE_URL}/users/${userInfo._id}/favorites`, {
          withCredentials: true,
        });
        const favIds = data.map(building => building._id);
        setFavoritesList(favIds);
      } catch (error) {
        console.error("Error fetching favorite buildings:", error);
      }
    };

    fetchFavorites();
  }, [userInfo]);

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
  );
};

export default WishlistButton;
