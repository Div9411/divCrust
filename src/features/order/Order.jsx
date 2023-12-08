import OrderItem from './OrderItem';

import { useParams } from 'react-router-dom';
import { getOrder } from '../../services/apiRestaurant';
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from '../../utils/helpers';
import { useQuery } from '@tanstack/react-query';
import Loader from '../../ui/Loader';
import Error from '../../ui/Error';
import toast from 'react-hot-toast';

function Order() {
  const { orderId } = useParams();
  const {
    isLoading,
    data: order,
    error,
  } = useQuery({
    queryKey: ['cabins', orderId],
    queryFn: () => getOrder(orderId),
    retry: 1, // only retries 1 time , if fetchng dont happen at first time
  });

  function handleCopyClick(password) {
    toast.dismiss(); //for dismissing existing toasts/alerts
    navigator.clipboard.writeText(password); //clipboard api
    toast.success('OrderId copied to clipboard!');
  }

  // Check if data is still loading
  if (isLoading) {
    return <Loader />;
  }

  // Check if there's an error
  if (error) {
    return <Error error={'OrderId does not exist :('} />;
  }

  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
    customer,
  } = order;

  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="space-y-8 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">
          Order #{id}{' '}
          <span className="cursor-pointer" onClick={() => handleCopyClick(id)}>
            🔗
          </span>
          status
        </h2>

        <div className="space-x-2">
          {priority && (
            <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-red-50">
              Priority
            </span>
          )}
          <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-green-50">
            {status} order
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-200 px-6 py-5">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : 'Order should have arrived'}
        </p>
        <p className="text-xs text-stone-500">
          (Estimated delivery: {formatDate(estimatedDelivery)})
        </p>
      </div>

      <ul className="dive-stone-200 divide-y border-b border-t">
        {cart.map((item) => (
          <OrderItem item={item} key={item.pizzaId} />
        ))}
      </ul>

      <div className="space-y-2 bg-stone-200 px-6 py-5">
        <p className="text-sm font-medium text-stone-600">
          Ordered by: {customer.toUpperCase()}
        </p>
        <p className="text-sm font-medium text-stone-600">
          Price pizza: {formatCurrency(orderPrice)}
        </p>
        {priority && (
          <p className="text-sm font-medium text-stone-600">
            Price priority: {formatCurrency(priorityPrice)}
          </p>
        )}
        <p className="font-bold">
          To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}
        </p>
      </div>
    </div>
  );
}

export default Order;
