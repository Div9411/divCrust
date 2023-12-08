import { useRouteError } from 'react-router-dom';
import LinkButton from './LinkButton';

function Error({ error = 'Server busy , please try again' }) {
  return (
    <div>
      <div className="m-auto text-2xl font-extrabold">{error}</div>

      <LinkButton to="-1">&larr; Go back</LinkButton>
    </div>
  );
}

export default Error;
