export const COUNT_SYMBOLS = 22;
export const cutString = (string: string, countSymbols: number = COUNT_SYMBOLS): string => string.length > COUNT_SYMBOLS ? string.slice(0, COUNT_SYMBOLS) + '...' : string;
