import express from "express";
import app from "../firebase/app.js";
import { getFirestore } from "firebase-admin/firestore";

const produtosRouter = express.Router();
const db = getFirestore(app);

produtosRouter.get("/produtos", async (req, res) => {
  try {
    const documents = await db.collection("produtos").get();
    const produtos = [];
    documents.forEach((doc) => produtos.push(doc.data()));
    return res.status(200).json(produtos);
  } catch (error) {
    return res.status(500).json({ msg: "Erro interno no servidor." });
  }
});

produtosRouter.get("/produtos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await db.collection("produtos").doc(id).get();
    if (doc.exists) {
      const produto = { ...doc.data(), id: doc.id };
      return res.status(200).json(produto);
    } else {
      return res.status(404).json({ msg: "Produto não encontrado." });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Erro interno no servidor." });
  }
});

produtosRouter.post("/produtos", async (req, res) => {
  try {
    const produto = req.body;
    await db.collection("produtos").add(produto);
    return res.status(201).json({ msg: "Produto cadastrado." });
  } catch (error) {
    return res.status(500).json({ msg: "Erro interno no servidor." });
  }
});

produtosRouter.put("/produtos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const produto = req.body;

    const docRef = db.collection("produtos").doc(id);
    const doc = await docRef.get();

    if (doc.exists) {
      await docRef.update(produto);
      return res.status(200).json({ msg: "Produto alterado." });
    } else {
      return res.status(404).json({ msg: "Produto não encontrado." });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Erro interno no servidor." });
  }
});

produtosRouter.delete("/produtos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const docRef = db.collection("produtos").doc(id);
    const doc = await docRef.get();

    if (doc.exists) {
      await docRef.delete();
      return res.status(200).json({ msg: "Produto excluido." });
    } else {
      return res.status(404).json({ msg: "Produto não encontrado." });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Erro interno no servidor." });
  }
});

export default produtosRouter;

// CRUD
// Create - Criar/Cadastrar
// Read - Ler/Consultar
// Update - Atualizar
// Delete - Excluir
