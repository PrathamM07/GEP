import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ITelevisionSpotsProps {
  description?: string;
  context?: WebPartContext;
  apiURL?: string;
  PageData?: any[];
  webparttitle:string;
  buttonColor: string;
  audio:string;
  video:string;
}
