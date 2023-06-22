const { ServiceBusClient } = require("@azure/service-bus");
const mongoose = require('mongoose');
require("dotenv").config();
const Song = require("./src/models/song");
const User = require("./src/models/user");
const Album = require("./src/models/album");
const Plan = require("./src/models/plan");
const Suscription = require("./src/models/suscription");
const Favorite = require("./src/models/favorite");
const Gender = require("./src/models/gender");
const connectionString = "Endpoint=sb://streaming-bus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=aArwwhxnpjwfFOgx2yyvsEXeQYihFwhAn+ASbKAE1+g=";
const queueName = "queue";
const { dbConnection } = require("./src/database/bisw");


dbConnection();
// Función para procesar los mensajes recibidos desde la cola
async function processMessages(messages, receiver) {
  for (const message of messages) {
    const messageBody = message.body;

    // Muestra los datos del mensaje como una cadena JSON legible
    console.log("Mensaje recibido:");
    console.log(messageBody);

    if (messageBody['Action'] == 1) {

      switch (messageBody['Table']) {
        case 'Users':
          const newUser = new User({
            id_user: messageBody['Data']['Id'],
            pais: messageBody['Data']['Pais'],
          });
          newUser.save();
          console.log("User Cargado");
          break;
        case 'Songs':
          const newSong = new Song({
            id_song: messageBody['Data']['Id'],
            id_album: messageBody['Data']['AlbumId'],
            id_gender: messageBody['Data']['GenderId'],
            name: messageBody['Data']['Name'],
            reproductions: messageBody['Data']['Reproductions'],
          });
          newSong.save();
          console.log("Song Cargada");
          break;
        case 'Genders':
          const newGender = new Gender({
            id_gender: messageBody['Data']['Id'],
            name: messageBody['Data']['Name'],
          });
          newGender.save();
          console.log("Genero Cargado");
          break;
        case 'Albums':
          const newAlbum = new Album({
            id_album: messageBody['Data']['Id'],
            id_user: messageBody['Data']['UserId'],
          });
          newAlbum.save();
          console.log("Album Cargado");
          break;
        case 'Plans':
          const newPlan = new Plan({
            id_plan: messageBody['Data']['Id'],
            name: messageBody['Data']['Name'],
            price: messageBody['Data']['Price'],
          });
          newPlan.save();
          console.log("Plan Cargado");
          break;
        case 'Suscriptions':
          const newSuscription = new Suscription({
            id_suscription: messageBody['Data']['Id'],
            id_user: messageBody['Data']['UserId'],
            id_plan: messageBody['Data']['PlanId'],
            fecha: messageBody['Data']['StartDate'],
          });
          newSuscription.save();
          console.log("Suscripcion Cargada");
          break;
        case 'Favorites':
          const newFavorite = new Favorite({
            id_user: messageBody['Data']['UserId'],
            id_song: messageBody['Data']['SongId'],
          });
          newFavorite.save();
          console.log("Favorite Cargada");
          break;
        default:
          // Caso por defecto
          console.log("Valor no reconocido");
      }

    } else {
      if (messageBody['Action'] == 2 && messageBody['Table'] == 'Songs') {
        Song.updateOne({ id_song: messageBody['Data']['Id'] }, { reproductions: messageBody['Data']['Reproductions'] })
          .then(() => {
            console.log('Song actualizada correctamente');
          })
          .catch((error) => {
            console.error('Error al actualizar la Song:', error);
          });
      }
    }

    // Confirma el mensaje para que se elimine de la cola
    await receiver.completeMessage(message);
  }
}

// Función para recibir mensajes de la cola
async function receiveMessages() {
  const serviceBusClient = new ServiceBusClient(connectionString);
  const receiver = serviceBusClient.createReceiver(queueName);

  try {
    console.log("Esperando mensajes...");

    // Recibe los mensajes de la cola en bucle infinito
    while (true) {
      const messages = await receiver.receiveMessages(1, {
        maxWaitTimeInMs: 5000, // Tiempo máximo de espera para recibir mensajes (en milisegundos)
      });

      if (messages.length > 0) {
        await processMessages(messages, receiver);
      } else {
        console.log("No hay mensajes en la cola.");
      }
    }
  } finally {
    await receiver.close();
    await serviceBusClient.close();
  }
}

// Llama a la función para recibir mensajes
receiveMessages().catch((err) => {
  console.log("Error al recibir mensajes:", err);
});
