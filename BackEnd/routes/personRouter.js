import express from "express";
import personController from "../controller/personController.js";

const personRouter = express.Router();

personRouter.get("/info", personController.getPersonInfo);
personRouter.get("/", personController.getPersons);
personRouter.get("/:id", personController.getPerson);
personRouter.delete("/:id", personController.deletePerson);
personRouter.post("/", personController.createPerson);
personRouter.put("/:id", personController.updatePerson);

export default personRouter;
