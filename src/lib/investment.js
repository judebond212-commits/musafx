export const basePlans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    min: 150,
    max: 999,
    rate: 8.88,
    duration: 3,
    returns: '888% increase Daily for 3 Days',
    color: '#818cf8'
  },

  {
    id: 'gold',
    name: 'Gold Plan',
    min: 5000,
    max: 10000,
    rate: 8.88,
    duration: 7,
    returns: '888% increase Daily for 7 Days',
    color: '#00c896'
  },

    {
    id: 'diamond',
    name: 'Diamond Plan',
    min: 1000,
    max: 4999,
    rate: 11.76,
    duration: 7,
    returns: '1176% increase Daily for 7 Days',
    color: '#3b82f6'
  },

]

/**
 * Calculates current investment balance based on elapsed time.
 * @param {number} initialAmount - The initial USD amount invested.
 * @param {string} planId - The ID of the plan (basic, professional, etc.)
 * @param {string|Date} startDate - The date the investment started.
 * @returns {number} The current calculated balance in USD.
 */
export function calculateCurrentBalance(initialAmount, planId, startDate) {
  if (!initialAmount || !planId || !startDate) return Number(initialAmount) || 0;

  const plan = basePlans.find(p => p.id.toLowerCase() === planId.toLowerCase());
  if (!plan) return Number(initialAmount);

  const start = new Date(startDate).getTime();
  const now = Date.now();
  const elapsedMs = now - start;
  const elapsedDays = Math.max(0, elapsedMs / (1000 * 60 * 60 * 24));

  // Cap at plan.duration
  const effectiveDays = Math.min(elapsedDays, plan.duration);

  // Daily interest calculation: Initial + (Initial * rate * days)
  const earnings = initialAmount * plan.rate * effectiveDays;
  const totalBalance = initialAmount + earnings;

  return totalBalance;
}
