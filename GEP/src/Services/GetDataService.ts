import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { IItems, Items, sp } from "@pnp/sp/presets/all";
import { PageContext } from "@microsoft/sp-page-context";
import axios from "axios";
import { result } from "lodash";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IWeb } from "@pnp/sp/webs";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IAllItems, IListOperationsService } from "./IListOperation";


export default class GetDataService implements IListOperationsService {

    constructor(private _context: WebPartContext) {
        sp.setup({
          spfxContext: _context
        });
      }
    public async getAllListItems(Item: IAllItems): Promise<any[]> {
        try {
          const orderByColumn = Item.orderByQuery ? Item.orderByQuery.columnName : 'Id';
          const orderByAscending = Item.orderByQuery ? Item.orderByQuery.ascending : true;
          return await sp.web.lists.getByTitle(Item.listName).items
            .filter(Item.filterQuery ? Item.filterQuery : '')
            .select(Item.selectQuery ? Item.selectQuery : '*')
            .expand(Item.expandQuery ? Item.expandQuery : '')
            .top(Item.topQuery ? Item.topQuery : 100)
            .orderBy(orderByColumn, orderByAscending).get();
        } catch (error) {
          // return Promise.reject(error);
          throw error;
        }
      }
 
      public async getAllLibraryItemsByFolder(libraryPath: string): Promise<any[]>{
        try {
          return await sp.web.getFolderByServerRelativeUrl(libraryPath).expand("Folders,Files").select("Files,Folders/ListItemAllFields").get();
        } catch (error) {
          throw error;
        }
      }
     
      public async getLibraryFolders(libraryName: string): Promise<any[]>{
        try {
          return await sp.web.lists.getByTitle(libraryName).rootFolder.folders.expand("ListItemAllFields").filter("ItemCount ne 0").get();
        } catch (error) {
          throw error;
        }
      }
   
   
  
}