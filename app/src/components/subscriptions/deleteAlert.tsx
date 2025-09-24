import { useState } from "react";
import {
    Button,
    CloseButton,
    Dialog,
    Portal,
    Box,
    Text,
    Heading,
    Kbd,
    Flex,
} from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import DeleteIcon from "../../assets/DeleteIcon";
import { Tooltip } from "../ui/tooltip";
import { deleteSubscription } from "../../api/subscription";
import { useSubscriptionsStore } from "../../stores/subscription";
import {WrongIcon2} from "../../assets/wrong";
type CancelSubscriptionAlertProps = {
    id?: string;
    subscriptionName?: string;
};

const CancelSubscriptionAlert = ({ id, subscriptionName }: CancelSubscriptionAlertProps) => {
    const { fetchSubscriptions, } = useSubscriptionsStore();

    const [isDeleting, setIsDeleting] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // To control dialog

    const onDeleteSubscription = async () => {
        setIsDeleting(true);
        let toastId: any = toaster.create({ description: "saving.....", type: "loading" });
        try {
            const response: any = await deleteSubscription(id);
            toaster.update(toastId, { description: response.message || "Subscription Cancelled  successfully", type: "success" });
            fetchSubscriptions()
        } catch (error: any) {
            console.error(error);
            toaster.update(toastId, { description: error?.data?.message || "Subscription Cancelled Failed", type: "error" });
        } finally {
            setIsDeleting(false);
        }
        return;
    }


    return (
        <Dialog.Root size={"xs"} open={isOpen} onOpenChange={(e) => setIsOpen(e.open)} placement="center">
            <Dialog.Trigger asChild>
                <Tooltip openDelay={100} positioning={{ placement: "bottom" }} content="Cancel Subscription">
                    <Button
                        bg={"red.600"} h={8} minW={8} p={1} borderRadius={5}
                        variant="ghost"
                        onClick={() => setIsOpen(true)}
                    >
                        <Box color="white">{WrongIcon2()}</Box>
                    </Button>
                </Tooltip>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                <Heading size="md">
                                    Cancel Subscription
                                </Heading>
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Text>
                                Are you sure you want to cancel <b>{subscriptionName || "this subscription"}</b>?
                            </Text>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button
                                colorPalette="red"
                                onClick={onDeleteSubscription}
                                loading={isDeleting}
                            >
                                confirm
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default CancelSubscriptionAlert;
