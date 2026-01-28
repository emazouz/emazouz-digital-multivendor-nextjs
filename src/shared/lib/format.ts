export const formatPrice = (price: string | number) => {
  return Number(price || 0).toFixed(2);
};
