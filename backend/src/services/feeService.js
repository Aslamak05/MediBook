import Settings from '../models/Settings.js';

export async function computeFee(doctorFee) {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  const commission = Math.round(doctorFee * settings.commissionPercent / 100);
  return {
    doctorFee,
    commission,
    totalFee: doctorFee + commission,
  };
}
