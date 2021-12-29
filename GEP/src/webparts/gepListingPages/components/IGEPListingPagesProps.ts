import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IGEPListingPagesProps {
  description?: string;
  context?: WebPartContext;
  apiURL?: string;
  maxItem: number;
  PageData?: any[];
  webparttitle:string;
  assettype:string;
 
}
