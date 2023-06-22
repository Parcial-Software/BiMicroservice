const express = require("express");
const Suscription = require("../models/suscription");
const Favorite = require("../models/favorite");
const Song = require("../models/song");
const router = express.Router();

router.get("/prueba", async function (req, res) {

  let category =  await Suscription.findOne({ id_country: '2' });

  console.log(category.updatedAt);

  return res.status(200).send(category);
});

router.get("/amountSuscriptionsByCountry", async function (req, res) {

  Suscription.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'id_user',
        foreignField: 'id_user',
        as: 'user'
      }
    },
    {
      $group: {
        _id: '$user.pais',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        pais: '$_id',
        cantidad: '$count'
      }
    }
  ])
    .then((result) => {
      console.log(result);
      return res.status(200).json(result);
    })
    .catch((error) => {
      console.error('Error al obtener la cantidad de suscripciones por país:', error);
    });
  

});

router.get("/amountSuscriptionsByTypePlan", async function (req, res) {

  Suscription.aggregate([
    {
      $lookup: {
        from: 'plans',
        localField: 'id_plan',
        foreignField: 'id_plan',
        as: 'plan'
      }
    },
    {
      $group: {
        _id: {
          plan: '$plan.name',
          pais: '$user.pais'
        },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        plan: '$_id.plan',
        pais: '$_id.pais',
        cantidad: '$count'
      }
    }
  ])
    .then((result) => {
      console.log(result);
      return res.status(200).send(result);
    })
    .catch((error) => {
      console.error('Error al obtener la cantidad de suscripciones por plan:', error);
    });
  
});

router.get("/twoSongMoreReplyforGenders", async function (req, res) {

  Song.aggregate([
    {
      $lookup: {
        from: 'genders',
        localField: 'id_gender',
        foreignField: 'id_gender',
        as: 'gender'
      }
    },
    {
      $sort: { reproductions: -1 }
    },
    {
      $group: {
        _id: '$gender.name',
        songs: { $push: { id_song: '$id_song', reproductions: '$reproductions' } }
      }
    },
    {
      $project: {
        _id: 0,
        genre: '$_id',
        topSongs: { $slice: ['$songs', 2] }
      }
    }
  ])
    .then((result) => {
      console.log(result);
      return res.status(200).json(result);
    })
    .catch((error) => {
      console.error('Error al obtener las canciones más reproducidas por género:', error);
    });
  
  
});

router.get("/mostListenedGenders", async function (req, res) {

  Song.aggregate([
    {
      $group: {
        _id: '$id_gender',
        totalReproductions: { $sum: '$reproductions' }
      }
    },
    {
      $lookup: {
        from: 'genders',
        localField: '_id',
        foreignField: 'id_gender',
        as: 'gender'
      }
    },
    {
      $project: {
        _id: 0,
        gender: { $arrayElemAt: ['$gender.name', 0] },
        totalReproductions: 1
      }
    },
    {
      $sort: { totalReproductions: -1 }
    }
  ])
    .then((result) => {
      console.log(result);
      return res.status(200).json(result);
    })
    .catch((error) => {
      console.error('Error al obtener los géneros más escuchados:', error);
    });  
  
});

router.get("/earningsByPlanType", async function (req, res) {

  Suscription.aggregate([
    {
      $lookup: {
        from: 'plans',
        localField: 'id_plan',
        foreignField: 'id_plan',
        as: 'plan'
      }
    },
    {
      $unwind: '$plan'
    },
    {
      $group: {
        _id: '$id_plan',
        totalGanancia: { $sum: { $toDouble: '$plan.price' } }
      }
    },
    {
      $lookup: {
        from: 'plans',
        localField: '_id',
        foreignField: 'id_plan',
        as: 'planInfo'
      }
    },
    {
      $project: {
        _id: 0,
        plan: { $arrayElemAt: ['$planInfo.name', 0] },
        ganancia: '$totalGanancia'
      }
    }
  ])
    .then((result) => {
      console.log(result);
      return res.status(200).json(result);
    })
    .catch((error) => {
      console.error('Error al obtener la ganancia de cada tipo de plan:', error);
    });
  
  
});

router.get("/fiveSongMoreFavorite", async function (req, res) {

  Favorite.aggregate([
    {
      $group: {
        _id: '$id_song',
        totalFavorites: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'songs',
        localField: '_id',
        foreignField: 'id_song',
        as: 'song'
      }
    },
    {
      $project: {
        _id: 0,
        songName: { $arrayElemAt: ['$song.name', 0] },
        totalFavorites: 1
      }
    },
    {
      $sort: { totalFavorites: -1 }
    },
    {
      $limit: 5
    }
  ])
    .then((result) => {
      console.log(result);
      return res.status(200).json(result);
    })
    .catch((error) => {
      console.error('Error al obtener las canciones más favoritas:', error);
    });
  
});

router.get("/earningsTotal", async function (req, res) {

  Suscription.aggregate([
    {
      $lookup: {
        from: 'plans',
        localField: 'id_plan',
        foreignField: 'id_plan',
        as: 'plan'
      }
    },
    {
      $unwind: '$plan'
    },
    {
      $group: {
        _id: null,
        totalGanancia: { $sum: { $multiply: ['$plan.price', 1] } }
      }
    },
    {
      $project: {
        _id: 0,
        totalGanancia: 1
      }
    }
  ])
    .then((result) => {
      console.log(result);
      return res.status(200).json(result);
    })
    .catch((error) => {
      console.error('Error al obtener la ganancia total de las suscripciones:', error);
    });
  
  
});

module.exports = router;
