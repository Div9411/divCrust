import { useLoaderData } from 'react-router-dom';
import { getMenu } from '../../services/apiRestaurant';
import MenuItem from './MenuItem';
import { useQuery } from '@tanstack/react-query';
import Loader from '../../ui/Loader';
import Error from '../../ui/Error';

function Menu() {
  const {
    isLoading,
    data: menu,
    error,
  } = useQuery({
    queryKey: ['cabins'],
    queryFn: getMenu,
  });

  // Check if data is still loading
  if (isLoading) {
    return <Loader />;
  }

  // Check if there's an error
  if (error) {
    return <Error />;
  }

  // Render the menu
  return (
    <ul className="divide-y divide-stone-200 px-2">
      {menu.map((pizza) => (
        <MenuItem pizza={pizza} key={pizza.id} />
      ))}
    </ul>
  );
}

export default Menu;
