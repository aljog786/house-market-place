import { useSelector } from 'react-redux';
import { FaHeart } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import {
  useGetUserFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation
} from '../slices/usersApiSlice';

const WishlistButton = ({ id }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?._id;

  const { data: favoritesData, refetch } = useGetUserFavoritesQuery(userId, { skip: !userId });
  const favoritesList = favoritesData ? favoritesData.map((building) => building._id) : [];

  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const handleFavoriteToggle = async () => {
    if (!userId) return;

    if (favoritesList.includes(id)) {
      await removeFavorite({ userId, buildingId: id });
    } else {
      await addFavorite({ userId, buildingId: id });
    }
    refetch();
  };

  const isFavorite = favoritesList.includes(id);

  return (
    <Button
      variant="light"
      className="position-absolute top-0 z-3 end-0 m-2 p-2 border-0 rounded-circle"
      onClick={handleFavoriteToggle}
    >
      <FaHeart size={20} className={isFavorite ? 'text-danger' : 'text-secondary'} />
    </Button>
  );
};

export default WishlistButton;
