const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from .env file if present
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Attempt to connect to MongoDB if a URI has been provided.  If not,
// the application will still run but persistence will be disabled.
const { MONGO_URI } = process.env;
let Simulation;
if (MONGO_URI) {
  try {
    mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    // Import the model only after mongoose is connected to avoid
    // circular import issues in some environments.
    Simulation = require('./models/Simulation');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
  }
}

/**
 * Calculate energy consumption and costs.
 *
 * @param {number} power - Power consumption in watts (W).
 * @param {number} hoursPerDay - Number of hours per day the device runs.
 * @param {number} daysPerMonth - Number of days per month the device runs.
 * @param {number} monthsPerYear - Number of months per year the device runs.
 * @param {number} costPerKwh - Cost of electricity per kilowatt hour.
 * @returns {{monthlyKwh:number, annualKwh:number, monthlyCost:number, annualCost:number}}
 */
function computeConsumption({ power, hoursPerDay, daysPerMonth, monthsPerYear, costPerKwh }) {
  const watts = Number(power);
  const hours = Number(hoursPerDay);
  const days = Number(daysPerMonth);
  const months = Number(monthsPerYear);
  const cost = Number(costPerKwh);

  // Convert to kilowatt hours
  const monthlyKwh = (watts / 1000) * hours * days;
  const annualKwh = monthlyKwh * months;

  const monthlyCost = monthlyKwh * cost;
  const annualCost = annualKwh * cost;
  return {
    monthlyKwh: parseFloat(monthlyKwh.toFixed(3)),
    annualKwh: parseFloat(annualKwh.toFixed(3)),
    monthlyCost: parseFloat(monthlyCost.toFixed(2)),
    annualCost: parseFloat(annualCost.toFixed(2)),
  };
}

// Calculation endpoint
app.post('/api/calculate', (req, res) => {
  try {
    const { power, hoursPerDay, daysPerMonth, monthsPerYear, costPerKwh } = req.body;
    if ([power, hoursPerDay, daysPerMonth, monthsPerYear, costPerKwh].some((v) => v === undefined)) {
      return res.status(400).json({ error: 'Missing input parameters' });
    }
    const result = computeConsumption({ power, hoursPerDay, daysPerMonth, monthsPerYear, costPerKwh });
    return res.json(result);
  } catch (error) {
    console.error('Error calculating consumption:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get all saved simulations (requires MongoDB)
app.get('/api/simulations', async (req, res) => {
  if (!Simulation) {
    return res.status(501).json({ error: 'MongoDB not configured' });
  }
  try {
    const simulations = await Simulation.find().sort({ createdAt: -1 });
    return res.json(simulations);
  } catch (error) {
    console.error('Error fetching simulations:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to save a new simulation (requires MongoDB)
app.post('/api/simulations', async (req, res) => {
  if (!Simulation) {
    return res.status(501).json({ error: 'MongoDB not configured' });
  }
  try {
    const { power, hoursPerDay, daysPerMonth, monthsPerYear, costPerKwh } = req.body;
    const result = computeConsumption({ power, hoursPerDay, daysPerMonth, monthsPerYear, costPerKwh });
    const simulation = new Simulation({
      power,
      hoursPerDay,
      daysPerMonth,
      monthsPerYear,
      costPerKwh,
      ...result,
    });
    await simulation.save();
    return res.json(simulation);
  } catch (error) {
    console.error('Error saving simulation:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});