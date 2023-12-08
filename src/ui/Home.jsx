import { useSelector } from 'react-redux';
import CreateUser from '../features/user/CreateUser';
import Button from './Button';

function Home() {
  const username = useSelector((state) => state.user.username);

  return (
    <div className=" my-10 px-4 text-center sm:my-16">
      <img
        className="divuImage"
        src="../../public/pizzaGif1.gif"
        alt="pizzaAnimatedImg"
      />
      <h1 className=" mb-4 text-xl font-semibold md:text-3xl">
        <div className="fontFamily sm:text-3xl md:text-6xl">
          Simply the finest Pizza.
        </div>
        <br />
        <span className=" text-yellow-500">
          A symphony of taste for happy hearts.
        </span>
      </h1>

      {username === '' ? (
        <CreateUser />
      ) : (
        <Button to="/menu" type="primary">
          Continue ordering, {username}
        </Button>
      )}
    </div>
  );
}

export default Home;
