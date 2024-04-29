export const pluralise = (word: string, num: number) =>
  num + ' ' + word + (num > 1 ? 's' : '');
