import { StorageItemType } from "./storageModel"

export type RecordSession = {
  id: number,
  type: StorageItemType.RECORDED_SESSION,
  url: string,
  events: any[],
}
