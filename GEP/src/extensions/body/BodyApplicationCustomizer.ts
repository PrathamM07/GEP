import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';
import { setup as pnpSetup } from "@pnp/common";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-groups/web";

import * as strings from 'BodyApplicationCustomizerStrings';
import {Constant} from '../../Frameworks/Constants/Constant'
import { Web } from '@pnp/sp/webs';
import GDService from '../../Services/GetDataService';

//import * as strings from 'BodyApplicationCustomizerStrings';

const LOG_SOURCE: string = 'BodyApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IBodyApplicationCustomizerProperties {
  // This is an example; replace with your own property
 // testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class BodyApplicationCustomizer
  extends BaseApplicationCustomizer<IBodyApplicationCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    pnpSetup({
      spfxContext: this.context
    });

    this.applyLogo();
    return Promise.resolve();
  }

  private applyLogo() {
    try {
      console.log(this.context.pageContext.web.absoluteUrl);
      const listName = "DefaultLogo";
      sp.site.rootWeb.lists.getByTitle(listName).items.orderBy("Modified",false).top(1).filter("Active eq 1").get().then((items: any[]) => {

        var extLogo = JSON.parse(items[0].ImageThumbnail);
        var Sitelogo = extLogo.serverUrl + "" + extLogo.serverRelativeUrl;
        //var redirectUrl = items[0].ExtensionUrl.Url;
        var activeStatue = items[0].Active;
        var openInNewTab = items[0].OpenInNewTab;

        console.log("Sitelogo:" + Sitelogo + ", redirectUrl:" + "" + ", activeStatus: " + activeStatue + ", openInNewTab:" + openInNewTab);

        // Checking for both condition if both are true will open in new Tab
        // if (activeStatue == true && openInNewTab == true) {
        //   $(() => {
        //     ($('[class^="logoImg"]')).each(function () {
        //       $(this).attr("src", Sitelogo);
        //     }
        //     );
            
        //     //On scroll set image logic logic and Url
        //     $("div").scroll(() => {
        //       ($('[class^="shyLogoImg"]')).each(function () {
        //         $(this).attr("src", Sitelogo);
        //       }
        //       );
              
        //     });
        //   });
        // }
        // //Logic for open the url in different Tab if openInNewTab is false          
        // if (activeStatue == true && openInNewTab == false) {
        //   $(() => {
        //     ($('[class^="logoImg"]')).each(function () {
        //       $(this).attr("src", Sitelogo);
        //     }
        //     );
           
        //     //On scroll set image and Url and open the url in same tab
        //     $("div").scroll(() => {
        //       ($('[class^="shyLogoImg"]')).each(function () {
        //         $(this).attr("src", Sitelogo);
        //       }
        //       );
             
        //     });
        //   });
        // }

      });
    } catch (error) {
      console.log(error);
    }

  }
}
