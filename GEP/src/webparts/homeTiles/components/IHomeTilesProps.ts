import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IHomeTilesProps {
  Title?: string;
  context?: WebPartContext;
  PlayIconUrl?:string;
  TileCategory?: string;
  HeadingIconUrl?: string;
}
