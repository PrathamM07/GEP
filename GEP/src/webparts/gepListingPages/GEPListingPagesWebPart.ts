import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneSlider,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption,

} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'WhitePaperDetailsWebPartStrings';
import GEPListingPages from './components/GEPListingPages';
import { IGEPListingPagesProps } from './components/IGEPListingPagesProps';
import { sp } from '@pnp/sp';
import { Web } from '@pnp/sp/presets/all';

export interface IGEPListingPagesWebPartProps {
  description: string;
  apiURL: string;
  sliderproperty: number;
  webpartname: string;
  dropdownTitle: string;

}
var propertypaneitem = [];

export default class GEPListingPagesWebPart extends BaseClientSideWebPart<IGEPListingPagesWebPartProps> {

  private _listFields: IPropertyPaneDropdownOption[] = [];

  public render(): void {

    const element: React.ReactElement<IGEPListingPagesProps> = React.createElement(
      GEPListingPages,
      {
        description: this.properties.description,
        context: this.context,
        assettype: this.properties.dropdownTitle ? this.properties.dropdownTitle : "White Papers",
        maxItem: this.properties.sliderproperty ? this.properties.sliderproperty : 8,
        apiURL: this.properties.apiURL ? this.properties.apiURL : "",
        webparttitle: this.properties.webpartname ? this.properties.webpartname : "",
      }
    );
    this.getPropertyPaneValue();
    ReactDom.render(element, this.domElement);
  }
  public async getPropertyPaneValue() {
    // get all the items from a sharepoint list
    var reacthandler = this;
    var items = [];
    const columnName = ["Title"];
    let web = Web(`${this.context.pageContext.web.absoluteUrl}/`);
    web.lists.getByTitle("AssetType").items.select(columnName.join(',')).get().then((data) => {
      for (var assettype in data) {
        items.push({ key: data[assettype].Title, text: data[assettype].Title });
      }
      console.log(items);
      propertypaneitem = items;
    });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private listsFetched: boolean;
  private dropdownOptions: IPropertyPaneDropdownOption[];
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [


                PropertyPaneTextField('webpartname', {
                  label: "Webpart Label",
                }),

                PropertyPaneSlider('sliderproperty', {
                  label: "Max Items",
                  min: 1,
                  max: 8,
                  showValue: true,
                  value: 8,
                  step: 1
                }),

                PropertyPaneDropdown('dropdownTitle', {
                  label: 'Choose the Asset Type',
                  options: propertypaneitem,
                  selectedKey: "White Papers"
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
