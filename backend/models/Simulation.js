const mongoose = require('mongoose');

/**
 * Simulation schema
 *
 * Stores both the input parameters for an energy consumption estimate
 * and the calculated results.  This schema is intentionally flat so that
 * documents can be indexed easily in MongoDB.  The `createdAt` field
 * captures when the simulation was recorded.
 */
const SimulationSchema = new mongoose.Schema({
  power: { type: Number, required: true },
  hoursPerDay: { type: Number, required: true },
  daysPerMonth: { type: Number, required: true },
  monthsPerYear: { type: Number, required: true },
  costPerKwh: { type: Number, required: true },
  monthlyKwh: { type: Number, required: true },
  annualKwh: { type: Number, required: true },
  monthlyCost: { type: Number, required: true },
  annualCost: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Simulation', SimulationSchema);