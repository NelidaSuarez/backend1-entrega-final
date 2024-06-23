import { request, response } from "express";
import productDao from "../dao/mongoDB/product.dao.js";

export const checkProductData = async (req = request, res = response, next) => {
  try {
    const { title, description, price, code, stock, category } = req.body;
    const newProduct = {
      title,
      description,
      price,
      code,
      stock,
      category,
    };

    const products = await productDao.getAll();
    // Validar que no se repita el campo de code
    const productExists = products.docs.find((p) => p.code === code); //agrego el .docs. xq antes devolvia un array y ahora develve formato docs
    if (productExists)
      return res.status(400).json({
        status: "Error",
        msg: `El producto con el código ${code} ya existe`,
      });

    // Validamos que los campos sean obligatorios
    const checkData = Object.values(newProduct).includes(undefined);
    if (checkData) return res.status(400).json({ status: "Error", msg: "Todos los datos son obligatorios" });

    next();
  } catch (error) {
    console.log(error, "en la comprobacion del producto");
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
};
