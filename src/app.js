import express from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import bodyParser from 'body-parser';

// Importing routes
import users from './routes/users';
import parcels from './routes/parcels';

const app = express();
// Use routes
app.use('/api/v1/users', users);
app.use('/api/v1/parcels', parcels);

// Bordy parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handler for 404 - Resource Not Found
app.use((req, res) => {
  res.status(404).send('Resource Not Found');
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
export default app;
