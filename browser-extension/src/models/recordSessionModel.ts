export type RecordSession = {
  id: number;
  url: string;
  events: any[];
  name: string;
  date: string;
  // TODO:
  // Should be remove optional operator
  // when user upgrade to 1.0.54
  preview?: string;
  docID?: string;
};
