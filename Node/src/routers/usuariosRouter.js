import express from "express";
import app from "../firebase/app.js";
import { getFirestore } from "firebase-admin/firestore";

const usuariosRouter = express.Router();
const db = getFirestore(app);

usuariosRouter.get("/usuarios", async (req, res) => {
  try {
    const snapshot = await db.collection("usuarios").get();
    const usuarios = [];
    snapshot.forEach((doc) => {
      usuarios.push({ ...doc.data(), id: doc.id });
    });
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ msg: "Erro interno no servidor." });
  }
});

usuariosRouter.get("/usuarios/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await db.collection("usuarios").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    return res.status(200).json({ ...doc.data(), id: doc.id });
  } catch (error) {
    return res.status(500).json({ msg: "Erro interno no servidor." });
  }
});

usuariosRouter.post("/usuarios", async (req, res) => {
  try {
    const nome = req.body;

    await db.collection("usuarios").add(nome);

    return res.status(201).json({ msg: "Usuário criado com sucesso." });
  } catch (error) {
    return res.status(500).json({ msg: "Erro interno no servidor." });
  }
});

usuariosRouter.put("/usuarios/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const atualizacao = req.body;

    const docRef = db.collection("usuarios").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    await docRef.update(atualizacao);
    return res.status(200).json({ msg: "Usuário atualizado com sucesso." });
  } catch (error) {
    return res.status(500).json({ msg: "Erro interno no servidor." });
  }
});

usuariosRouter.delete("/usuarios/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const docRef = db.collection("usuarios").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    await docRef.delete();
    return res.status(200).json({ msg: "Usuário removido com sucesso." });
  } catch (error) {
    return res.status(500).json({ msg: "Erro interno no servidor." });
  }
});

export default usuariosRouter;
