export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
};

export const formatCurrency = amount => {
  return `₹ ${amount}`;
};

export const validateName = name => {
  if (!name || name.trim().length === 0) {
    return {valid: false, message: 'Name is required'};
  }
  if (name.trim().length < 2) {
    return {valid: false, message: 'Name must be at least 2 characters'};
  }
  return {valid: true};
};

export const validateLocation = location => {
  if (!location || location.trim().length === 0) {
    return {valid: false, message: 'Location is required'};
  }
  if (location.trim().length < 3) {
    return {valid: false, message: 'Location must be at least 3 characters'};
  }
  return {valid: true};
};

export const validateAmount = amount => {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return {valid: false, message: 'Please enter a valid amount'};
  }
  if (numAmount < 50) {
    return {valid: false, message: 'Minimum amount is ₹50'};
  }
  if (numAmount > 10000) {
    return {valid: false, message: 'Maximum amount is ₹10,000'};
  }
  return {valid: true};
};

export const getAvatarColor = text => {
  if (!text || typeof text !== 'string') return '#FFD54F';

  const colors = ['#FFD54F', '#D6E4F0', '#4CAF50', '#FF8A65', '#90CAF9'];

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const truncateText = (text, maxLength) => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export default {
  generateId,
  formatCurrency,
  validateName,
  validateLocation,
  validateAmount,
  getAvatarColor,
  sleep,
  truncateText,
};
