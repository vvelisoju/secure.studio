import { Flex, Text, Input, Button } from "@chakra-ui/react";
import { Field } from "../ui/field";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { convertToUTC, formatDateTime, convertDateTimeFormat, getNextMonthFirstMidnightUTC } from "../../utils/date";
import useServiceStore from "../../stores/services";
import useAuthStore from "../../stores/auth";
import { useBookingSummaryStore } from "../../stores/bookingSummary";

const formSchemaForUsers = z.object({
    startTime: z
        .string({ required_error: "Start time is required" })
        .refine((value) => !isNaN(Date.parse(value)), { message: "Invalid date format" })
    // .refine((value) => new Date(value).getMinutes() === 0, { message: "Start time must be in full hours (HH:00)" })
    // .refine((value) => new Date(value) >= new Date(), { message: "Start time cannot be in the past" })
    ,

    endTime: z.string()
});

const formSchemaForAdmin = z.object({
    startTime: z.string({ required_error: "Start time is required" })
        .refine((value) => !isNaN(Date.parse(value)), { message: "Invalid date format" })
    // .refine((value) => new Date(value).getMinutes() === 0, { message: "Start time must be in full hours (HH:00)" })
    ,
    endTime: z.string()
});

const HourForm = () => {
    const { role } = useAuthStore()
    const formSchema = role === "SUPER_ADMIN" ? formSchemaForAdmin : formSchemaForUsers;
    const { durationDates, setScheduleCount, scheduleCount, selectedPlan, setDurationDates, setPaymentCard, setStartTimeError, extendValidity } = useServiceStore();
    const { register, handleSubmit, setValue, watch, formState } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { startTime: convertDateTimeFormat(durationDates?.startTime), endTime: convertDateTimeFormat(durationDates?.endTime) },
    });
    const startTime = watch("startTime");
    const { prorata } = useBookingSummaryStore();

    // Watch for errors in the form state
    useEffect(() => {
        if (formState.errors.startTime) {
            setStartTimeError(true);
            // You can also add additional state changes here if needed
        } else {
            setStartTimeError(false);
        }
    }, [formState.errors.startTime]);


    const updateEndTime = () => {
        if (startTime) {
            const startDate = new Date(startTime);
            const newEndDate = new Date(startDate.getTime() + scheduleCount * 60 * 60 * 1000);
            setValue("endTime", formatDateTime(newEndDate));
        }
    };

    const onSubmit = handleSubmit(async (data) => {
        const startTime = convertToUTC(data.startTime);
        const endTime = prorata ? getNextMonthFirstMidnightUTC() : convertToUTC(data.endTime);
        setDurationDates({ startTime, endTime });
        setPaymentCard(true);
    }, () => setPaymentCard(false));


    useEffect(() => {
        if (startTime) {
            // updateEndTime();
            onSubmit();
        }
    }, [startTime, scheduleCount]);

    const handleIncreaseHours = () => setScheduleCount(scheduleCount + 1);
    const handleDecreaseHours = () => setScheduleCount(Math.max(1, scheduleCount - 1));
    return (
        <form>
            <Flex flexDir={"column"} gap={5} mt={5} flexGrow={1} alignItems="start">
                <Field color={"blackAlpha.700"} label="Start DateTime" required flexGrow={1} w="100%" justifyContent="center" invalid={!!formState.errors.startTime}
                    errorText={formState.errors.startTime?.message} helperText="Ex: 05-03-2025 05:00 AM">
                    <Input
                        step="3600"
                        outlineColor="primary"
                        _focus={{ borderColor: "primary" }}
                        type="datetime-local"
                        min={convertDateTimeFormat(durationDates?.startTime)}
                        {...register("startTime")}
                        css={extendValidity && {
                            '&::-webkit-datetime-edit-hour-field': {
                                display: 'none'
                            },
                            '&::-webkit-datetime-edit-minute-field': {
                                display: 'none'
                            },
                            '&::-webkit-datetime-edit-second-field': {
                                display: 'none'
                            },
                            '&::-webkit-datetime-edit-ampm-field': {
                                display: 'none'
                            },
                            '&::-webkit-clear-button': {
                                display: 'none'
                            },
                            '&::-webkit-inner-spin-button': {
                                display: 'none'
                            }
                        }}
                    />
                </Field>
                <Field flexGrow={1} w="100%" justifyContent="center">
                    <Text fontWeight="500" fontSize="0.9em" color="blackAlpha.800">End DateTime</Text>
                    <Input
                        disabled={prorata}
                        step="3600"
                        outlineColor="primary"
                        _focus={{ borderColor: "primary" }}
                        type="datetime-local"
                        value={watch("endTime")}
                        css={extendValidity && {
                            '&::-webkit-datetime-edit-hour-field': {
                                display: 'none'
                            },
                            '&::-webkit-datetime-edit-minute-field': {
                                display: 'none'
                            },
                            '&::-webkit-datetime-edit-second-field': {
                                display: 'none'
                            },
                            '&::-webkit-datetime-edit-ampm-field': {
                                display: 'none'
                            },
                            '&::-webkit-clear-button': {
                                display: 'none'
                            },
                            '&::-webkit-inner-spin-button': {
                                display: 'none'
                            }
                        }}
                    />
                </Field>

            </Flex>
            {
                selectedPlan?.durationValueSelect === "USER_SELECTED" &&
                <Flex mt={4} gap={3} alignItems="center">
                    <Button h={10} w={10} borderRadius={"50%"} onClick={handleDecreaseHours} disabled={scheduleCount === 1}>-1</Button>
                    <Text>{scheduleCount} {scheduleCount === 1 ? "hour" : "hours"}</Text>
                    <Button h={10} w={10} borderRadius={"50%"} onClick={handleIncreaseHours}>+1</Button>
                </Flex>
            }
        </form>
    );
};

export default HourForm;
