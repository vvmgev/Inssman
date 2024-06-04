export const COUNT_SYMBOLS = 22;
export const cutString = (string: string, countSymbols: number = COUNT_SYMBOLS): string =>
  string.length > countSymbols ? string.slice(0, countSymbols) + "..." : string;
