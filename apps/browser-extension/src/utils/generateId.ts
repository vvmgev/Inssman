export const generateId = (): number =>
  parseInt(
    `${Date.now() % 10}${Math.floor(Math.random() * 50)}${Math.floor(Math.random() * 50)}${Math.floor(
      Math.random() * 50
    )}`
  );
