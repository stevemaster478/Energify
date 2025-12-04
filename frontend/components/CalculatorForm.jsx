import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';

/**
 * A form that collects input parameters for an energy consumption calculation
 * and displays the results.  Results are calculated by sending a POST request
 * to the backend API defined in the environment variable
 * `NEXT_PUBLIC_API_BASE_URL`.  If the variable is not set, the request is
 * sent relative to the current origin.
 */
const CalculatorForm = () => {
  const { t } = useLanguage();
  const [inputs, setInputs] = useState({
    power: '',
    hoursPerDay: '',
    daysPerMonth: '',
    monthsPerYear: '',
    costPerKwh: '',
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setResults([]);
    setInputs({ power: '', hoursPerDay: '', daysPerMonth: '', monthsPerYear: '', costPerKwh: '' });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    // Validate numeric fields
    const {
      power,
      hoursPerDay,
      daysPerMonth,
      monthsPerYear,
      costPerKwh,
    } = inputs;
    if (
      [power, hoursPerDay, daysPerMonth, monthsPerYear, costPerKwh].some(
        (v) => v === '' || isNaN(parseFloat(v)),
      )
    ) {
      setError('Please fill all fields with valid numbers.');
      return;
    }
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          power: parseFloat(power),
          hoursPerDay: parseFloat(hoursPerDay),
          daysPerMonth: parseFloat(daysPerMonth),
          monthsPerYear: parseFloat(monthsPerYear),
          costPerKwh: parseFloat(costPerKwh),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to calculate');
      }
      const data = await response.json();
      setResults((prev) => [
        ...prev,
        {
          id: Date.now(),
          input: { ...inputs },
          result: data,
        },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="power">
              {t('power_label')}
            </label>
            <input
              type="number"
              step="0.01"
              name="power"
              id="power"
              value={inputs.power}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 dark:border-gray-700 px-2 py-1 bg-white dark:bg-gray-700"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="hoursPerDay">
              {t('hours_per_day_label')}
            </label>
            <input
              type="number"
              step="0.1"
              name="hoursPerDay"
              id="hoursPerDay"
              value={inputs.hoursPerDay}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 dark:border-gray-700 px-2 py-1 bg-white dark:bg-gray-700"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="daysPerMonth">
              {t('days_per_month_label')}
            </label>
            <input
              type="number"
              step="1"
              name="daysPerMonth"
              id="daysPerMonth"
              value={inputs.daysPerMonth}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 dark:border-gray-700 px-2 py-1 bg-white dark:bg-gray-700"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="monthsPerYear">
              {t('months_per_year_label')}
            </label>
            <input
              type="number"
              step="1"
              name="monthsPerYear"
              id="monthsPerYear"
              value={inputs.monthsPerYear}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 dark:border-gray-700 px-2 py-1 bg-white dark:bg-gray-700"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1" htmlFor="costPerKwh">
              {t('cost_per_kwh_label')}
            </label>
            <input
              type="number"
              step="0.01"
              name="costPerKwh"
              id="costPerKwh"
              value={inputs.costPerKwh}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 dark:border-gray-700 px-2 py-1 bg-white dark:bg-gray-700"
              required
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '...' : t('calculate_button')}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            {t('reset_button')}
          </button>
        </div>
      </form>
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t('results_heading')}</h2>
          {results.map(({ id, input, result }, idx) => (
            <div
              key={id}
              className="p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 shadow"
            >
              <p className="text-sm font-semibold mb-2">
                Simulation {idx + 1} – {input.power} W × {input.hoursPerDay} h/day × {input.daysPerMonth} days/month × {input.monthsPerYear} months
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  {t('monthly_consumption')}: <span className="font-medium">{result.monthlyKwh}</span>
                </div>
                <div>
                  {t('annual_consumption')}: <span className="font-medium">{result.annualKwh}</span>
                </div>
                <div>
                  {t('monthly_cost')}: <span className="font-medium">{result.monthlyCost}</span>
                </div>
                <div>
                  {t('annual_cost')}: <span className="font-medium">{result.annualCost}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalculatorForm;