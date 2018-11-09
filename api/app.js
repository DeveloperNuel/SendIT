import express from 'express';
import bodyParser from 'body-parser';

// Importing routes
import users from './routes/users';
import parcels from './routes/parcels';

const app = express();

// Bordy parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use routes
app.use('/api/v1/users', users);
app.use('/api/v1/parcels', parcels);

// Handler for 404 - Resource Not Found
app.use((req, res) => {
  res.status(404).send('Resource Not Found');
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
