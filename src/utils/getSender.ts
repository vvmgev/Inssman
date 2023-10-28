import { PageSource } from "src/models/pageSource";
import MessageSender = chrome.runtime.MessageSender;


export const getSender = (sender: MessageSender): PageSource => {
  if(sender.tab){
    return PageSource.Options;
  }
  return PageSource.Popup;
}
