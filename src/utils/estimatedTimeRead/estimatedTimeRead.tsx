export const estimatedTimeRead = (numberWords: number): number => {
  const minutes = numberWords / 200;
  return minutes;
};
