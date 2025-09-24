import { CheckboxCard, CheckboxGroup, DialogOpenChangeDetails, Heading } from "@chakra-ui/react"
import { Button, createListCollection, Flex, Grid, GridItem, Input, Spinner, Text, Dialog } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { z } from "zod";
import { Field } from "../ui/field";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "../ui/select";
import { Controller, useForm } from "react-hook-form";
import { toaster } from "../ui/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import useServiceStore from "../../stores/services";
import { updateMeetingRoomSetting, getMeetingRoomSetting } from "../../api/meetingRoom";
import { DateTime } from "luxon"

const timeRegex = /^(?:[01]?\d|2[0-3]):(00|30)$/; // Ensures minutes are 00 or 30
const formSchema = z
    .object({
        startTime: z.string().nullable().optional().refine(
            (value) => !value || timeRegex.test(value),
            { message: "Start time must be in HH:00 or HH:30 format" }
        ),
        endTime: z.string().nullable().optional().refine(
            (value) => !value || timeRegex.test(value),
            { message: "End time must be in HH:00 or HH:30 format" }
        ),
        slotDuration: z.string().array(),
        pricePerSlot: z.string()
    })
    .refine(
        (data) => {
            if (!data.startTime || !data.endTime) return true; // Skip validation if one is missing
            const [startHour, startMinute] = data.startTime.split(":").map(Number);
            const [endHour, endMinute] = data.endTime.split(":").map(Number);
            const startTotalMinutes = startHour * 60 + startMinute;
            const endTotalMinutes = endHour * 60 + endMinute;
            return startTotalMinutes < endTotalMinutes;
        },
        {
            message: "Start time must be earlier than end time",
            path: ["startTime"], // Error will be attached to startTime
        }
    );

const slotDurationValues = createListCollection({
    items: [
        { label: "30 Minutes", value: "30" },
        { label: "1 Hour", value: "60" },
    ],
});


const items = [
    { value: "Monday", title: "Mon" },
    { value: "Tuesday", title: "Tue" },
    { value: "Wednesday", title: "Wed" },
    { value: "Thursday", title: "Thu" },
    { value: "Friday", title: "Fri" },
    { value: "Saturday", title: "Sat" },
    { value: "Sunday", title: "Sun" },
]


const MeetingRoom = () => {
    const { register, handleSubmit, formState: { errors }, clearErrors, control, reset } = useForm({ resolver: zodResolver(formSchema) });
    const [weekdays, setWeekdays] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {
        (async () => {
            const settings = await getMeetingRoomSetting();
            const response = await settings.data;
            const utcStartTime = DateTime.fromFormat(response.startTime, 'HH:mm', { zone: 'utc' });
            const utcEndTime = DateTime.fromFormat(response.endTime, 'HH:mm', { zone: 'utc' });
            const localStartTime = utcStartTime.setZone(Intl.DateTimeFormat().resolvedOptions().timeZone).toFormat('HH:mm');
            const localEndTime = utcEndTime.setZone(Intl.DateTimeFormat().resolvedOptions().timeZone).toFormat('HH:mm');
            reset({
                startTime: localStartTime,
                endTime: localEndTime,
                slotDuration: [`${response.slotDuration}`],
                pricePerSlot: response.pricePerSlot + "",
            });
            setWeekdays([...response.weekdays]);
        })();
    }, [])

    let toastId: any
    const save = async (data: any) => {
        const startTime = DateTime.fromFormat(data.startTime, 'HH:mm');
        const endTime = DateTime.fromFormat(data.endTime, 'HH:mm');
        const utcStartTime = startTime.toUTC().toFormat('HH:mm');
        const utcEndTime = endTime.toUTC().toFormat('HH:mm');
        // Clean the input
        const cleanData = { ...data };
        delete cleanData.errorMessage;
        const pass409 = cleanData.pass409;
        delete cleanData.pass409 || false;
        const body = { ...cleanData, weekdays, slotDuration: data.slotDuration[0], startTime: utcStartTime, endTime: utcEndTime, pricePerSlot: parseFloat(data.pricePerSlot) };
        const response: any = await updateMeetingRoomSetting(body, pass409);
        toaster.update(toastId, { description: response.message || "Service Time slots created  successfully", type: "success" });
        reset();
    }


    const onSubmit = handleSubmit(async (data: any) => {
        if (weekdays.length == 0) {
            return setError("Please select atleast one week day");
        }
        toastId = toaster.create({ description: "saving.....", type: "loading" });
        clearErrors();
        setError("");

        try {
            await save({ ...data });
        } catch (error: any) {
            if (error.status === 409) {
                setFormData({ ...data, errorMessage: error?.data?.message }); // Store form data for dialog
                setIsDialogOpen(true); // Open dialog
                toaster.remove(toastId);
            } else {
                toaster.update(toastId, { description: error?.data?.message || "Service Time slots creation Failed", type: "error" });
            }
        } finally {
        }
    }, (errors) => {
        console.error("Form validation errors:", errors);
    });

    const handleConfirm = async () => {
        if (formData) {
            try {
                await save({ ...formData, pass409: true });
                setIsDialogOpen(false); // Close dialog
                setFormData(null); // Clear stored data
            } catch (error: any) {
                toaster.update(toastId, {
                    description: error?.data?.message || "Failed to save with pass409",
                    type: "error",
                });
            }
        }
    };

    const handleCancel = () => {
        setIsDialogOpen(false); // Close dialog
        setFormData(null); // Clear stored data
        reset();
    };

    return (
        <Flex w={"100%"} flexDir={"column"} gap={5} border={"1px solid"} borderColor={"gray.200"} boxShadow={"lg"} p={5} borderRadius={10} >
            <Flex justifyContent={"space-between"} flexDir={"column"} >
                <Heading size="xl">Meeting Room Settings</Heading>
                <form id="addSettings" onSubmit={onSubmit}>
                    <Flex flexDir={"column"} gap={5} mt={5}>
                        <Flex gap={3} w={"100%"} >
                            <Grid flexGrow={1}
                                templateColumns={{ base: "repeat(1, 1fr)" }}
                                templateRows="repeat(1fr)"
                                gap={5}
                                color={"blackAlpha.700"}
                            >
                                <GridItem colSpan={1} >
                                    <CheckboxGroup value={weekdays} color="blackAlpha.700" onValueChange={(value) => {
                                        if (value.length == 0) {
                                            setError("Please Provide atleast one week day");
                                        } else {
                                            setError("");
                                        }
                                        setWeekdays(value);
                                    }}>
                                        <Flex gap="2" mt={2} flexWrap={"wrap"} justifyContent={"start"} alignItems={"center"}>
                                            {items.map((item) => (
                                                <CheckboxCard.Root maxW={"-webkit-fit-content"}
                                                    variant="surface"
                                                    colorPalette="blue"
                                                    key={item.value}
                                                    value={item.value}>
                                                    <CheckboxCard.HiddenInput />
                                                    <CheckboxCard.Control py={1} px={3}>
                                                        <CheckboxCard.Content>
                                                            <CheckboxCard.Label >{item.title}</CheckboxCard.Label>
                                                        </CheckboxCard.Content>
                                                    </CheckboxCard.Control>
                                                </CheckboxCard.Root>
                                            ))}

                                        </Flex>
                                        <Text fontSize={"sm"} color={"red"} >{error}</Text>
                                    </CheckboxGroup>
                                </GridItem>
                                <GridItem colSpan={1} >
                                    <Field required label="Start Time" invalid={!!errors.startTime} errorText={errors.startTime?.message}>
                                        <Input variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="time" {...register("startTime")} placeholder="Select Date of Birth" />
                                    </Field>
                                </GridItem>
                                <GridItem colSpan={1} >
                                    <Field required label="End Time" invalid={!!errors.endTime} errorText={errors.endTime?.message}>
                                        <Input variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="time" {...register("endTime")} placeholder="Select Joining Date" />
                                    </Field>
                                </GridItem>
                                <GridItem colSpan={1} >
                                    <Field required label="Time Slot Duration" invalid={!!errors.slotDuration} errorText={errors.slotDuration?.message}>
                                        <Controller
                                            control={control}
                                            name="slotDuration"
                                            render={({ field }) => (
                                                <SelectRoot
                                                    variant={"outline"}
                                                    name={field.name}
                                                    value={field.value}
                                                    onValueChange={({ value }) => { field.onChange(value) }}
                                                    onInteractOutside={() => field.onBlur()}
                                                    collection={slotDurationValues}

                                                >
                                                    <SelectTrigger>
                                                        <SelectValueText placeholder="Select Duration" />
                                                    </SelectTrigger>
                                                    <SelectContent zIndex={9999} >
                                                        {slotDurationValues.items.map((type) => (
                                                            <SelectItem item={type} key={type.value}>
                                                                {type.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </SelectRoot>
                                            )}
                                        />
                                    </Field>
                                </GridItem >
                                <GridItem colSpan={1} >
                                    <Field required label="Price Per Slot" invalid={!!errors.pricePerSlot} errorText={errors.pricePerSlot?.message}>
                                        <Input variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="number" {...register("pricePerSlot")} placeholder="Add Price per slot" />
                                    </Field>
                                </GridItem>
                            </Grid>
                        </Flex>
                        <Button form="addSettings" type="submit" alignSelf={"end"} >Update</Button>
                    </Flex>
                </form>
            </Flex>
            {/* Dialog for 409 Conflict */}
            <Dialog.Root open={isDialogOpen} onOpenChange={(e: DialogOpenChangeDetails) => { setIsDialogOpen(e.open); }}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.CloseTrigger />
                        <Dialog.Header>
                            <Dialog.Title>Conflict Detected</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            {formData?.errorMessage}
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button onClick={handleCancel} variant="outline">Cancel</Button>
                            <Button onClick={handleConfirm} colorPalette="blue">Confirm</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </Flex>
    )

}

export default MeetingRoom