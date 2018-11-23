import express from 'express';
import uuid from 'uuid';
import Parcels from '../data/parcels';
import User from '../data/users';

const router = express.Router();

// Create parcel
router.post('/', (req, res) => {
  // const { userId } = req.body;
  // Price in $
  const priceNormal = 20;
  const priceExpress = 70;
  // Parcel price in $
  let price;

  const user = User.filter(customer => customer.userId === req.body.userId)[0];

  const calculatePrice = pricePerOneWeight => (
    (pricePerOneWeight * req.body.weight * req.body.height * req.body.length)
  );
  if (user) {
    // Price per Service on Normal
    // Price per Service on Express
    price = req.body.From === req.body.services
      ? calculatePrice(priceNormal)
      : calculatePrice(priceExpress);
    const pId = uuid.v4();
    const parcelWith = { ...req.body };
    parcelWith.parcelId = pId;
    parcelWith.status = 'pending';

    // Save parcel
    Parcels.push(parcelWith);

    console.log(Parcels);
    return res.status(201).json({
      success: true,
      message: 'Parcel created successfully',
      parcelId: pId,
      parcel: parcelWith,
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
  const parcelDeliveries = [...Parcels];
  res.status(200).json({
    success: true,
    message: 'Parcels retrieved successfully',
    parcels: parcelDeliveries,
  });
});

// Get a specific parcels
router.get('/:parcelId', (req, res) => {
  console.log(req.params.parcelId);
  const parcelDelivery = Parcels.filter(
    parcel => parcel.parcelId === req.params.parcelId,
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
  const parcel = Parcels.find(item => item.parcelId === req.params.parcelId);
  const index = Parcels.indexOf(parcel);
  console.log(index);
  if (index >= 0) {
    // Parcels[index].status = 'canceled';
    if (Parcels[index].status === 'pending') {
      return res.status(200).send({
        success: true,
        message: 'Parcel is successfully cancelled',
      });
    }
    return res.status(405).send({
      success: false,
      message: 'Not allowed to cancel a parcel with status of delivered or In Transit',
    });
  }
  return res.status(404).send({
    success: false,
    message: 'Parcel not found',
  });
});

export default router;
