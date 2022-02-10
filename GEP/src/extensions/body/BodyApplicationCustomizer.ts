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
import * as $ from 'jquery';
import * as strings from 'BodyApplicationCustomizerStrings';
import { Web } from '@pnp/sp/webs';
import GDService from '../../Services/GetDataService';
// import "./home-logo.css";
//import * as strings from 'BodyApplicationCustomizerStrings';
//  require('./../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
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
 
if(window.location.href.toLowerCase().indexOf("sitepages")>0)
{
  pnpSetup({
    spfxContext: this.context
  });
    //this.applyLogo();
    const head: any = document.getElementsByTagName("head")[0];
    var link:HTMLLinkElement = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    head.insertAdjacentElement("beforeEnd",link);
}
    return Promise.resolve();
  }

  private applyLogo() {
    try {
      console.log(this.context.pageContext.web.absoluteUrl);
      const listName = "DefaultLogo";
      sp.site.rootWeb.lists.getByTitle(listName).items.orderBy("Modified",false).top(1).filter("ID eq 1").get().then((items: any[]) => {

        var extLogo = JSON.parse(items[0].ImageThumbnail);
        var Sitelogo = extLogo.serverUrl + "" + extLogo.serverRelativeUrl;
        var redirectUrl = items[0].ExternalApi;
        
       
        console.log("Sitelogo:" + Sitelogo + ", redirectUrl:" + redirectUrl );

        // Checking for both condition if both are true will open in new Tab
        // if (Sitelogo != "") {
        //   $(() => {
        //     ($('[class^="logoImg-50"]')).each(function () {
        //       $(this).attr("src", Sitelogo);
        //     }
        //     );
        //     ($('[class^="logoWrapper-49"]')).each(function () {
        //       $(this).attr("href", redirectUrl);
        //       $(this).attr("target", "_blank");
        //     }
        //     );
        //     //On scroll set image logic logic and Url
        //     $("div").scroll(() => {
        //       ($('[class^="shyLogoImg-69"]')).each(function () {
        //         $(this).attr("src", Sitelogo);
        //       }
        //       );
        //       ($('[class^="shyLogoWrapper-68"]')).each(function () {
        //         $(this).attr("href", redirectUrl);
        //         $(this).attr("target", "_blank");
        //       }
        //       );
        //     });
        //   });
        // }
        //Logic for open the url in different Tab if openInNewTab is false          
        if (Sitelogo != "") {
        $(() => {
          ($('[class^="logoImg"]')).each(function () {
            $(this).attr("src", Sitelogo);
          }
          );
          ($('[class^="logoWrapper"]')).each(function () {
            $(this).attr("href", redirectUrl);
            $(this).attr("target", "_blank");
          }
          );
          //On scroll set image logic logic and Url
          $("div").scroll(() => {
            ($('[class^="shyLogoImg"]')).each(function () {
              $(this).attr("src", Sitelogo);
            }
            );
            ($('[class^="shyLogoWrapper"]')).each(function () {
              $(this).attr("href", redirectUrl);
              $(this).attr("target", "_blank");
            }
            );
          });
        });
      }

      });
    } catch (error) {
      console.log(error);
    }

  }
}