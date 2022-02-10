import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IRadioSpotsProps {
  description?: string;
  context?: WebPartContext;
  apiURL?: string;
  PageData?: any[];
  webparttitle:string;
  buttonColor: string;
  audio:string;
  video:string;
}
