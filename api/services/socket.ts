import { Socket } from "socket.io";
import { serviceMisc } from "./service";
import { timeSlotService, timeSlotMiscService } from "./timeSlot";

const serviceSockets = new Map();
const roomMap = new Map();

export const initializeSocket = (io: any) => {
    // Socket.IO setup
    io.on("connection", (socket: Socket) => {
        roomMap.set(socket.id, []);
        socket.on("getSlots", async (data) => {
            const timeSlots = await timeSlotMiscService.getAllTimeslotByDates(data);
            socket.emit("slots", timeSlots);
            // Create a unique key based on serviceId, startTime, and endTime
            const key = `${data.startTime}-${data.endTime}`;
            // Store the socket in the map
            if (!serviceSockets.has(key)) {
                serviceSockets.set(key, new Set());
            }
            serviceSockets.get(key).add(socket);
        });

        socket.on("selectSlot", async (data) => {
            if (roomMap.has(socket.id)) {
                const existingData = roomMap.get(socket.id);
                existingData.push(data);
                roomMap.set(socket.id, existingData);
            } else {
                roomMap.set(socket.id, [data]);
            }

            // Run a function to update the slot
            await timeSlotService.updateTimeslot(data?.slotDetails);
            // Fetch updated slots
            const updatedTimeSlots = await timeSlotMiscService.getAllTimeslotByDates(data);
            // Emit the updated slots to all connected sockets with the same key
            const key = `${data.startTime}-${data.endTime}`;
            if (serviceSockets.has(key)) {
                serviceSockets.get(key).forEach((s: any) => {
                    s.emit("slots", updatedTimeSlots);
                });
            }
        });
 
        socket.on("cleanUpSlots", async (slots) => {
            for (let data of slots) {
                // Run a function to update the slot
                await timeSlotService.updateTimeslot({ ...data?.slotDetails, userId: null });
                // Fetch updated slots
                const updatedTimeSlots = await timeSlotMiscService.getAllTimeslotByDates(data);
                // Emit the updated slots to all connected sockets with the same key
                const key = `${data.startTime}-${data.endTime}`;
                if (serviceSockets.has(key)) {
                    serviceSockets.get(key).forEach((s: any) => {
                        s.emit("slots", updatedTimeSlots);
                    });
                }
            }
            roomMap.delete(socket.id);
        });

        // Handle disconnection
        socket.on("disconnect", async () => {
            if (roomMap.has(socket.id)) {
                const dataArray = roomMap.get(socket.id);
                for (const data of dataArray) {
                    await timeSlotService.updateTimeslot({ id: data.slotDetails.id, isBooked: false, userId: null });
                }
                // Fetch updated slots
                for (const data of dataArray) {
                    const updatedTimeSlots = await timeSlotMiscService.getAllTimeslotByDates(data);
                    // Emit the updated slots to all connected sockets with the same key
                    const key = `${data.startTime}-${data.endTime}`;
                    if (serviceSockets.has(key)) {
                        serviceSockets.get(key).forEach((s: any) => {
                            s.emit("slots", updatedTimeSlots);
                        });
                    }
                }
                roomMap.delete(socket.id);
        }
            socket.disconnect(true);
        // Remove the socket from the map
        serviceSockets.forEach((sockets, key) => {
            if (sockets.has(socket)) {
                sockets.delete(socket);
            }
        });
    });
});
};
