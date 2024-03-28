export const chooseRandomOperation = () => {
  let operations = ['+', '-', '*', '/'];
  let randomIndex = Math.floor(Math.random() * operations.length);
  return operations[randomIndex];
};
