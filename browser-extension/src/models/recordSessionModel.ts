import { StorageItemType } from "./storageModel";

export type RecordSession = {
  id: number;
  url: string;
  events: any[];
  name: string;
  date: string;
};
