import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IInformationalTilesProps {
  context?: WebPartContext;
  apiURL?: string;
  maxItem?: number;
  PageData?: any[];
  webparttitle?:string;
  assettype?:string;
  buttonColor?: string;
  descriptionlength?: number;
}
