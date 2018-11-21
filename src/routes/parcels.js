import express from 'express';
import Parcels from '../data/parcels';
import User from '../data/users';

const router = express.Router();

// Create parcel
router.post('/', (req, res) => {
  console.log(req.body);
  const { userId, parcel } = req.body;
  const priceNormal = 20; // Price in $
  const priceExpress = 70;
  // Parcel price in $
  let price;

  const user = User.filter(customer => customer.userId === userId)[0];

  const calculatePrice = pricePerOneWeight => (
    (pricePerOneWeight * parcel.weight * parcel.height * parcel.length)
  );
  if (user) {
    // Price per Service on Normal
    // Price per Service on Express
    price = parcel.From === parcel.Service
      ? calculatePrice(priceNormal)
      : calculatePrice(priceExpress);
    // Parcel Id
    const pId = Parcels.length + 1;
    const parcelWith = parcel;
    parcelWith.parcelId = pId;
    parcelWith.status = 'Pending';

    // Save parcel
    Parcels.push({ userId, price, parcel: parcelWith });

    console.log(Parcels);
    return res.status(201).json({
      success: true,
      message: 'Parcel created successfully',
      parcelId: pId,
      price: Number(price.toFixed(2)),
    });
  }

  return res.status(404).json({
    success: false,
    message: 'User not Exist',
  });
});

// Get all parcels
router.get('/', (req, res) => {
  const parcelDeliveries = [];
  console.log(Parcels);
  Parcels.map(parcel => parcelDeliveries.push(parcel.parcel));
  res.status(200).json({
    success: true,
    message: 'Parcels retrieved successfully',
    parcels: parcelDeliveries,
  });
});

// Get a specific parcels
router.get('/:parcelId', (req, res) => {
  const parcelDelivery = Parcels.filter(
    parcel => parcel.parcel.parcelId === Number(req.params.parcelId),
  );

  if (parcelDelivery.length > 0) {
    return res.status(200).json({
      success: true,
      message: `Parcel of id ${req.params.parcelId} retrieved successfully`,
      parcel: parcelDelivery[0],
    });
  }
  return res.status(404).json({
    success: false,
    message: `Parcel of id ${req.params.parcelId} does not exist`,
  });
});

// Cancel a parcel delivery order
router.put('/:parcelId/cancel', (req, res) => {
  let parcelDelivery = {};
  let index;
  req.params.parcelId = Number(req.params.parcelId);
  for (let i = 0; i < Parcels.length; i += 1) {
    if (Parcels[i].parcel.parcelId === req.params.parcelId) {
      parcelDelivery = Parcels[i].parcel;
      index = i;
      break;
    }
  }

  if (parcelDelivery) {
    if (
      parcelDelivery.status === 'pending' || parcelDelivery.status === 'canceled'
    ) {
      parcelDelivery.status = 'canceled';
      if (Parcels[index].parcel.parcelId === parcelDelivery.parcelId) {
        Parcels[index].parcel.status = 'canceled';
        return res.status(200).send({
          success: true,
          message: 'Parcel is successfully canceled',
          parcel: parcelDelivery,
        });
      }
      return res.status(405).send({
        success: false,
        message: 'Data index changed. Try again!',
      });
    }
    return res.status(405).send({
      success: false,
      message:
        'Not allowed to cancel a parcel with status of delivered or transit',
    });
  }
  return res.status(404).send({
    success: false,
    message: 'Parcel not found',
  });
});

export default router;
