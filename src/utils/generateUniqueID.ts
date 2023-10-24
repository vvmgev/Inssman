export const generateUniqueID = (): number => {
  return Number(Date.now() + Math.round(Math.random() * Math.random() * 10000));
}
