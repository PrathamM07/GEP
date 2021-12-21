import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IWhitePaperDetailsProps {
  description?: string;
  context?: WebPartContext;
  apiURL?: string;
  maxItem?: number;
  PageData?: any[];
}
