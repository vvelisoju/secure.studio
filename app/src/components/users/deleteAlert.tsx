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
} from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import { useUserStore } from "../../stores/users";
import DeleteIcon from "../../assets/DeleteIcon";
import { Tooltip } from "../ui/tooltip";

type Mode = "single" | "multiple";

type DeleteUserAlertProps = {
    mode: Mode,
    id?: string;
    userName?: string;
    ids?: string[];
    reset?: (value: string[]) => void
};

const DeleteUserAlert = ({ id, userName, mode, ids, reset }: DeleteUserAlertProps) => {
    const { deleteUser, deleteUsers, fetchUsers, page } = useUserStore();

    const [isDeleting, setIsDeleting] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // To control dialog

    const onDeleteUser = async () => {
        setIsDeleting(true);
        const toastId = toaster.create({
            description: "Deleting user...",
            type: "loading",
        });

        try {
            const response: any = await deleteUser(id);
            toaster.update(toastId, {
                description: response.message || "User deleted successfully",
                type: "success",
            });
            fetchUsers(page, "USER");
            setIsOpen(false); // Close dialog on success
        } catch (error: any) {
            toaster.update(toastId, {
                description: error?.data?.message || "User delete failed",
                type: "error",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const onDeleteUsers = async () => {
        setIsDeleting(true);
        let toastId: any = toaster.create({ description: "Deleting users.....", type: "loading" });
        try {
            const response: any = await deleteUsers(ids);
            toaster.update(toastId, { description: response.message || "Users Deleted successfully", type: "success" });
            fetchUsers(page, "USER");
        } catch (error: any) {
            toaster.update(toastId, { description: error?.data?.message || "Users Delete Failed", type: "error" });
        } finally {
            setIsDeleting(false);
            reset?.([]);
        }
    }

    return (
        <Dialog.Root size={"xs"} open={isOpen} onOpenChange={(e) => setIsOpen(e.open)} placement="center">
            <Dialog.Trigger asChild>
                {
                    mode === "single" ?
                        <Tooltip openDelay={100} positioning={{ placement: "bottom" }} content="Delete User">
                            <Button
                                variant="ghost"
                                p={0}
                                h="auto"
                                minW="auto"
                                w="auto"
                                onClick={() => setIsOpen(true)}
                            >
                                <Box color="red.600">{DeleteIcon()}</Box>
                            </Button>
                        </Tooltip>
                        : <Button onClick={() => setIsOpen(true)} variant="outline" size="sm">
                            Delete <Kbd>{DeleteIcon()}</Kbd>
                        </Button>
                }
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                <Heading size="md">
                                    {mode === "single" ? "Delete User" : "Delete Multiple Users"}
                                </Heading>
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            {mode === "single" ? (
                                <Text>
                                    Are you sure you want to delete <b>{userName || "this user"}</b>?
                                </Text>
                            ) : (
                                <Text>
                                    You are about to delete <b>{ids?.length || 0} users</b>. This action cannot be undone.
                                </Text>
                            )}
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button
                                colorPalette="red"
                                onClick={mode === "single" ? onDeleteUser : onDeleteUsers}
                                loading={isDeleting}
                            >
                                Delete
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

export default DeleteUserAlert;
