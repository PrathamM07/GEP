import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { IItems, Items, sp } from "@pnp/sp/presets/all";
import { PageContext } from "@microsoft/sp-page-context";
import axios from "axios";

interface IOps {
    getListData(listName,topquery?): Promise<any>;

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

    public getListData(listName) {

        return axios.get(listName);

    }




}