export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const delayThanThrow = async <TError extends Error>(error: TError) => {
  await sleep(Math.ceil(Math.random() * 1000 + 1000));
  throw error;
};
