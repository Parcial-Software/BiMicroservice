const express = require("express");
const Suscription = require("../models/suscription");
const router = express.Router();

//registrar final: todo
/*router.get("/registrarPasoFinal", async function (req, res) {
  var response = new ResponseResult();
  try {
    response = await UsuarioCtrl.registroFinalizado(response);
  } catch (e) {
    response.ok = false;
    response.msg = "Excepcion al realizar registro: " + e;
  }
  return res.status(200).send(response.getResponseData());
});*/

router.get("/prueba", async function (req, res) {

  let category =  await Suscription.findOne({ id_country: '2' });

  console.log(category.updatedAt);

  return res.status(200).send(category);
});

module.exports = router;
