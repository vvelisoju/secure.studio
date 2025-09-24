import { Flex, Text, Input, Button } from "@chakra-ui/react";
import { Field } from "../ui/field";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import useServiceStore from "../../stores/services";
import { convertDateFormat, convertToUTC, formatDate, getNextMonthFirstMidnightUTC } from "../../utils/date"
import useAuthStore from "../../stores/auth";
import { useBookingSummaryStore } from "../../stores/bookingSummary";

const formSchemaForUsers = z.object({
    startTime: z
        .string({ required_error: "Start time is required" })
        .refine((value) => !isNaN(Date.parse(value)), { message: "Invalid date format" })
    // .refine((value) => new Date(value).getMinutes() === 0, { message: "Start time must be in full hours (HH:00)" })
    // .refine((value) => new Date(value) >= new Date(), { message: "Start time cannot be in the past" })
    ,

    endTime: z.string(),
});

const formSchemaForAdmin = z.object({
    startTime: z.string({ required_error: "Start time is required" })
        .refine((value) => !isNaN(Date.parse(value)), { message: "Invalid date format" })
    // .refine((value) => new Date(value).getMinutes() === 0, { message: "Start time must be in full hours (HH:00)" })
    ,
    endTime: z.string(),
});

const DayForm = () => {
    const { role } = useAuthStore()
    const formSchema = role === "SUPER_ADMIN" ? formSchemaForAdmin : formSchemaForUsers;
    const { durationDates, scheduleCount, setScheduleCount, selectedPlan,
        setDurationDates, setPaymentCard, setStartTimeError, bookingType, extendValidity } = useServiceStore();
    const { prorata } = useBookingSummaryStore();
    const { register, handleSubmit, setValue, watch, formState } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { startTime: convertDateFormat(durationDates?.startTime), endTime: convertDateFormat(durationDates?.endTime) },
    });
    const startTime = watch("startTime");
    const endTime = watch("endTime");
    const updateEndTime = () => {
        if (startTime) {
            const startDate = new Date(startTime);
            const newEndDate = new Date(startDate);
            newEndDate.setDate(startDate.getDate() + scheduleCount);
            setValue("endTime", formatDate(newEndDate));
        }
    };


    // Watch for errors in the form state
    useEffect(() => {
        if (formState.errors.startTime) {
            setStartTimeError(true);
            // You can also add additional state changes here if needed
        } else {
            setStartTimeError(false);
        }
    }, [formState.errors.startTime]);


    const onSubmit = handleSubmit(async (data) => {
        const startTime = convertToUTC(data.startTime);
        const endTime = prorata ? getNextMonthFirstMidnightUTC() : convertToUTC(data.endTime);
        setDurationDates({ startTime, endTime })
    }, () => setPaymentCard(false));



    useEffect(() => {
        if (startTime) {
            // updateEndTime();
            onSubmit();
        }
    }, [startTime, endTime, scheduleCount]);

    const handleIncreaseDays = () => setScheduleCount(scheduleCount + 1);
    const handleDecreaseDays = () => setScheduleCount(Math.max(1, scheduleCount - 1));

    return (
        <form onSubmit={onSubmit}>
            <Flex flexDir={"column"} gap={5} mt={5} flexGrow={1} alignItems={"start"}>
                <Field color={"blackAlpha.700"} label="Start DateTime" required flexGrow={1} w="100%" justifyContent="center" invalid={!!formState.errors.startTime}
                    errorText={formState.errors.startTime?.message} helperText="Ex: 05-03-2025 05:00 AM">
                    <Input
                        outlineColor={"primary"}
                        _focus={{ borderColor: "primary" }}
                        type="date"
                        min={convertDateFormat(durationDates?.startTime)}
                        {...register("startTime")}
                    />
                </Field>
                <Field flexGrow={1} w="100%" justifyContent="center">
                    <Text fontWeight={"500"} fontSize={"0.9em"} color={"blackAlpha.800"}>End DateTime</Text>
                    <Input
                        disabled={prorata}
                        outlineColor={"primary"}
                        _focus={{ borderColor: "primary" }}
                        type="date"
                        {...register("endTime")}
                    />
                </Field>
            </Flex>
            {
                selectedPlan?.durationValueSelect === "USER_SELECTED" &&
                <Flex mt={4} gap={3} alignItems="center">
                    <Button h={10} w={10} borderRadius={"50%"} onClick={handleDecreaseDays} disabled={scheduleCount === 1}>-1</Button>
                    <Text>{scheduleCount} {scheduleCount === 1 ? "day" : "days"}</Text>
                    <Button h={10} w={10} borderRadius={"50%"} onClick={handleIncreaseDays}>+1</Button>
                </Flex>
            }
        </form>
    );
};

export default DayForm;
