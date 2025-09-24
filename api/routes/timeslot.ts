import { Router } from "express";
import { timeslotController } from "../controllers/timeslot";
const router = Router();

router.get("/", timeslotController.getTimeslotsByDates);
router.get("/booked", timeslotController.getBookedTimeslotOfUser);

router.put("/book", timeslotController.bookTimeSlots);


export default router;
