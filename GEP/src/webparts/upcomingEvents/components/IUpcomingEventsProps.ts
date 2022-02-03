import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IUpcomingEventsProps {
  description?: string;
  context?: WebPartContext;
  apiURL?: string;
  maxItem: number;
  PageData?: any[];
  webparttitle:string;
  contenttype:string;
  buttonColor: string;

}

