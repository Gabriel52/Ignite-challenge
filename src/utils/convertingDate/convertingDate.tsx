import { LANGUAGE } from '../../contants';

export const convertingDate = (date: string): string => {
  const treatmentDate = new Date(date).toLocaleDateString(LANGUAGE, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  return treatmentDate;
};
