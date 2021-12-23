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

interface IOps {
    getListData(listName,topquery?): Promise<any>;
    getListData(listName, columns?, expand?, filter?): Promise<any>;
   
}

export default class GetDataService implements IOps {

    public static readonly serviceKey: ServiceKey<IOps> = ServiceKey.create<IOps>("ops", GetDataService);

    constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(() => {
            const pageContext = serviceScope.consume(PageContext.serviceKey);
            sp.setup({
                spfxContext: {
                    pageContext: pageContext
                }
            });
        });
    }
    public getListDatas(listName, columns?, expand?,filter?){

      let _items:IItems = sp.web.lists.getByTitle(listName).items;
     
      if(expand){
          _items = _items.expand(expand);
      }        
      if(columns){
          _items = _items.select(columns);
      }       
      if(filter){
          _items = _items.filter(filter);
      }        

      return new Promise<any>((resolve) => {
          return _items.getAll().then(data => { resolve(data); });
      });
  }

    public getListData(listName) {

        return axios.get(listName);

    }
   
   
  
}