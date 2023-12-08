import { useEffect, useState } from 'react';
import { createOrder } from '../../services/apiRestaurant';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice';
import EmptyCart from '../cart/EmptyCart';
import Button from '../../ui/Button';
import { formatCurrency } from '../../utils/helpers';
import { fetchAddress } from '../user/userSlice';

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const {
    username,
    status: addressStatus,
    position,
    address,
  } = useSelector((state) => state.user);

  const isLoadingAddress = addressStatus === 'loading';

  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch } = useForm();

  useEffect(() => {
    // watch  changes in the 'address' field and trigger a re-rendeer
    setValue('address', address);
  }, [address, setValue]);

  const { isPending, mutate, data, formState } = useMutation({
    mutationFn: (newOrder) => createOrder(newOrder),
    onSuccess: (data) => {
      // console.log('Mutation successful', data);
      navigate(`/order/${data.id}`);

      dispatch(clearCart());
    },
    onError: (error) => {
      console.error('Mutation failed', error);
    },
  });

  const dispatch = useDispatch();

  const cart = useSelector(getCart);

  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? Math.round(totalCartPrice * 0.2) : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  function submitForm(data) {
    const order = {
      ...data,
      cart: cart,
      priority: withPriority,
    };
    mutate(order);
  }

  function onError(errors) {
    toast.dismiss(); //for dismissing existing toasts/alerts

    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 1) {
      // Show individual toasts for single errors
      toast.error(errors[errorKeys[0]]?.message);
    } else if (errorKeys.length > 1) {
      // Aggregate messages for multiple errors
      const errorMessages = errorKeys.map(
        (fieldName) => errors[fieldName]?.message
      );
      const errorMessage = errorMessages.join('\n');
      toast.error(errorMessage);
    }
  }

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      <form onSubmit={handleSubmit(submitForm, onError)}>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input customer grow"
            type="text"
            defaultValue={username}
            name="customer"
            {...register('customer', {
              required: 'Name is required',
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message:
                  'Please enter a valid name (alphabetic characters only)',
              },
            })}
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input
              className="input phone w-full"
              type="tel"
              name="phone"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{5,}$/,
                  message:
                    'Please enter a valid phone number (at least 5 numeric characters)',
                },
              })}
            />
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input address w-full"
              type="text"
              disabled={isLoadingAddress}
              value={watch('address')}
              name="address"
              {...register('address', {
                required: 'Address data is required.',
              })}
            />
            {addressStatus === 'error' && (
              <p className="rext-red-700 mt-2 rounded-md bg-red-100 p-2 text-xs">
                There was a problem getting your address. Please fill this field
                manually!
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className="absolute right-[3px] top-[3px] z-50 md:right-[5px] md:top-[5px]">
              <Button
                disabled={isLoadingAddress}
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get Position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <input
          type="hidden"
          name="position"
          value={
            position.latitude && position.longitude
              ? `${position.latitude},${position.longitude}`
              : ''
          }
          {...register('position')}
        />

        <button
          disabled={isPending}
          className={` rounded bg-yellow-400 px-4 py-2 font-bold text-white hover:bg-yellow-500 ${
            isPending ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {!isPending
            ? `Order now for ${formatCurrency(totalPrice)}`
            : 'Submitting'}
        </button>
      </form>
    </div>
  );
}

export default CreateOrder;
