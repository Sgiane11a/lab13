import { pool } from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const getContacts = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM contacts");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchByApellido = async (req, res) => {
  try {
    const { apellido } = req.query;
    const [rows] = await pool.query("SELECT * FROM contacts WHERE apellidos LIKE ?", [`%${apellido}%`]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createContact = async (req, res) => {
  try {
    const { nombre, apellidos, correo, fecha_nac } = req.body;
    let foto_url = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "contacts" });
      foto_url = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const [result] = await pool.query(
      "INSERT INTO contacts (nombre, apellidos, correo, fecha_nac, foto_url) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellidos, correo, fecha_nac, foto_url]
    );

    res.json({ id: result.insertId, nombre, apellidos, correo, fecha_nac, foto_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellidos, correo, fecha_nac } = req.body;
    let foto_url = req.body.foto_url;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "contacts" });
      foto_url = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    await pool.query(
      "UPDATE contacts SET nombre=?, apellidos=?, correo=?, fecha_nac=?, foto_url=? WHERE id=?",
      [nombre, apellidos, correo, fecha_nac, foto_url, id]
    );

    res.json({ message: "Contacto actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM contacts WHERE id=?", [id]);
    res.json({ message: "Contacto eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
