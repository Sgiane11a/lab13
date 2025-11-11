import express from "express";
import multer from "multer";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  searchByApellido
} from "../controllers/contactController.js";

const router = express.Router();
const upload = multer({ dest: "src/uploads/" });

router.get("/", getContacts);
router.get("/buscar", searchByApellido);
router.post("/", upload.single("foto"), createContact);
router.put("/:id", upload.single("foto"), updateContact);
router.delete("/:id", deleteContact);

export default router;
