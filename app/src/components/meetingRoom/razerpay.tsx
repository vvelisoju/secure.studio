import { Button, Spinner } from '@chakra-ui/react';
import { cancelOrder, createOrder, paymentFail, createOrderForMeetingRooms } from '../../api/payment';
import { useState } from 'react';
import { toaster } from "../ui/toaster";
import useServiceStore from '../../stores/services';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/users';
import useAuthStore from '../../stores/auth';
import { fetchBookingDetailsWithOrderId } from '../../api/booking';
import { useSubscriptionsStore } from '../../stores/subscription';
import { useMeetingRoomStore } from '../../stores/meetingRoom';
import { useTimeSlotStore } from '../../stores/timeSlots';
const RazorpayPayment = ({ totalAmount, slots }: any) => {
    // meeting room related
    const { setMeetingRoomOpen, loading, setLoading } = useMeetingRoomStore();
    const { fetchBookedSlotsOfUser } = useTimeSlotStore();

    const handlePayment = async () => {
        setLoading(true)
        try {

            // Get the computed value of --secondary-color
            const rootStyles = getComputedStyle(document.documentElement);
            const secondaryColor = rootStyles.getPropertyValue('--secondary-color').trim() || '#006198'; // Default if not found

            // Replace with your Razorpay test key
            const testKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

            const response = await createOrderForMeetingRooms('', { timeSlotIds: slots, totalAmount });
            const order = await response.data
            const orderId = order.orderId;
            let toastId: any;
            const options = {
                key: testKey,
                amount: totalAmount * 100, // 50000 paise = ₹500
                currency: 'INR',
                name: 'Secure Studio',
                description: 'Test Transaction',
                "order_id": orderId,
                image: 'https://dev-22neuro.blr1.cdn.digitaloceanspaces.com/Secure-Studio/dev/documents/test/861390f0-991a-4ecf-bf39-753753a2f1b7.png',
                handler: async function () {
                    fetchBookedSlotsOfUser();
                    setLoading(false);
                    setMeetingRoomOpen(false);
                },
                prefill: {
                    name: 'Secure Studio',
                },
                theme: {
                    color: secondaryColor,
                },
                modal: {
                    ondismiss: async () => {
                        try {
                            let canceledResponse = await cancelOrder(order.bookingId);
                            toastId = toaster.create({ description: canceledResponse.message || "Order Cancelled", type: "error" });
                            setLoading(false);
                        } catch (error) {
                            toaster.update(toastId, { description: response.data.message || "Order Cancelled Failed", type: "error" });
                            setLoading(false);
                        }
                    },
                }
            }
            const rzp = new (window as any).Razorpay(options);

            rzp.on('payment.failed', async (response: any) => {
                console.log("razerpay-payment-failed", response);
                await paymentFail(order.bookingId)
            });

            rzp.open();
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Button width={"100%"} bg={"orange.600"} flexGrow={1} disabled={loading ? true : false} opacity={loading ? 0.8 : 1} onClick={() => { setMeetingRoomOpen(false); handlePayment() }} size="lg" mt={4}>
            {loading ? <Spinner /> : "Confirm & pay"}
        </Button>
    );
};

export default RazorpayPayment;