import { Flex, Text, Input, Button } from "@chakra-ui/react";
import { Field } from "../ui/field";
import { ReactNode, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { convertDateFormat, convertToUTC, formatDateTime, getEndOfMonthEndTimeLocal, getNextMonthFirstMidnightUTC } from "../../utils/date";
import useServiceStore from "../../stores/services";
import { formatDate, getFutureDateMonth } from "../../utils/date";
import useAuthStore from "../../stores/auth";
import { useBookingSummaryStore } from "../../stores/bookingSummary";

const formSchemaForUsers = z.object({
    startTime: z
        .string({ required_error: "Start time is required" })
        .refine((value) => !isNaN(Date.parse(value)), { message: "Invalid date format" }),
    // .refine((value) => new Date(value).getMinutes() === 0, { message: "Start time must be in full hours (HH:00)" })
    // .refine((value) => new Date(value) >= new Date(), { message: "Start time cannot be in the past" })
    // .refine((value) => new Date(value).getDate() <= 28, { message: "Start date cannot be after the 28th" }),

    endTime: z.string({ required_error: "End time is required" }),
});

const formSchemaForAdmin = z.object({
    startTime: z.string({ required_error: "Start time is required" })
        .refine((value) => !isNaN(Date.parse(value)), { message: "Invalid date format" }),
    // .refine((value) => new Date(value).getMinutes() === 0, { message: "Start time must be in full hours (HH:00)" })
    // .refine((value) => new Date(value).getDate() <= 28, { message: "Start date cannot be after the 28th" }),
    endTime: z.string({ required_error: "End time is required" }),
});


const MonthForm = () => {
    const { role } = useAuthStore()
    const formSchema = role === "SUPER_ADMIN" ? formSchemaForAdmin : formSchemaForUsers;
    const { durationDates, setScheduleCount, scheduleCount, setPaymentCard, selectedPlan, setDurationDates, setStartTimeError, bookingType, extendValidity } = useServiceStore();
    const { register, handleSubmit, setValue, watch, formState } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { startTime: convertDateFormat(durationDates?.startTime), endTime: convertDateFormat(durationDates?.endTime) },
    });
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


    const startTime = watch("startTime");
    const endTime = watch("endTime");


    const onSubmit = handleSubmit(async (data) => {
        const startTime = convertToUTC(data.startTime);
        const endTime = prorata ? convertToUTC(getEndOfMonthEndTimeLocal(data.startTime)) : convertToUTC(data.endTime);
        setValue("endTime", convertDateFormat(endTime));
        setDurationDates({ startTime, endTime })

    }, () => setPaymentCard(false));

    useEffect(() => {
        // if (startTime) {
        //     const startDate = new Date(startTime);
        //     if (startDate.getDate() > 28) {
        //         setValue("startTime", formatDate(new Date(startDate.setDate(28))));
        //     }
        //     setValue("endTime", formatDate(getFutureDateMonth(startDate, scheduleCount)));
        // }
        onSubmit();
    }, [startTime, endTime, prorata, scheduleCount, setValue]);

    useEffect(() => {
        onSubmit()
    }, [selectedPlan?.id, prorata])

    return (
        <form onSubmit={onSubmit}>
            <Flex flexDir={"column"} gap={5} mt={5} flexGrow={1} alignItems={"start"}>
                <Field color={"blackAlpha.700"} label="Start DateTime" required flexGrow={1} w="100%" justifyContent="center" invalid={!!formState.errors.startTime}
                    errorText={formState.errors.startTime?.message} helperText="Start date should be on or before 28th">
                    <Input
                        outlineColor={"primary"}
                        _focus={{ borderColor: "primary" }}
                        type="date"
                        min={role !== "SUPER_ADMIN" ? convertDateFormat(durationDates?.startTime) : ""}
                        {...register("startTime")}
                    />
                </Field>
                <Field flexGrow={1} w="100%" justifyContent="center" invalid={!!formState.errors.endTime}
                    errorText={formState.errors.endTime?.message}>
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
                <Flex mt={4} gap={2} alignItems={"center"}>
                    <Button h={10} w={10} borderRadius={"50%"} onClick={() => setScheduleCount(Math.max(1, scheduleCount - 1))}>
                        -1
                    </Button>
                    <Text>{scheduleCount} {scheduleCount === 1 ? "month" : "months"}</Text>
                    <Button h={10} w={10} borderRadius={"50%"} onClick={() => setScheduleCount(scheduleCount + 1)}>
                        +1
                    </Button>
                </Flex>
            }
        </form>
    );
};

export default MonthForm;