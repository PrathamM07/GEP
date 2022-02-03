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

import * as strings from 'UpcomingEventsWebPartStrings';
import UpcomingEvents from './components/UpcomingEvents';
import { IUpcomingEventsProps } from './components/IUpcomingEventsProps';
import { sp } from '@pnp/sp';
import { Web } from '@pnp/sp/presets/all';
export interface IUpcomingEventsWebPartProps {
  description: string;
  apiURL: string;
  sliderproperty: number;
  webpartname: string;
  dropdowncontent:string;
  color: string;
  
}
var propertypaneitem = [];
export default class UpcomingEventsWebPart extends BaseClientSideWebPart<IUpcomingEventsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IUpcomingEventsProps> = React.createElement(
      UpcomingEvents,
      {
        description: this.properties.description,
        context: this.context,
        maxItem: this.properties.sliderproperty ? this.properties.sliderproperty : 8,
        apiURL: this.properties.apiURL ? this.properties.apiURL : "",
        webparttitle: this.properties.webpartname ? this.properties.webpartname : "",
        contenttype:this.properties.dropdowncontent?this.properties.dropdowncontent:"Upcoming Events",
        buttonColor: this.properties.color ? this.properties.color : "#0083cf",
       
      }
    );
    this.getPropertyPaneValue();
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
  public async getPropertyPaneValue() {
    // get all the items from a sharepoint list
    var reacthandler = this;
    var items = [];
    const columnName = ["Title"];
    let web = Web(`${this.context.pageContext.web.absoluteUrl}/`);
    web.lists.getByTitle("Contents").items.select(columnName.join(',')).get().then((data) => {
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
                PropertyPaneDropdown('dropdowncontent', {
                  label: 'Choose Page Content',
                   options: propertypaneitem,
                   selectedKey: "Upcoming Events",
                                
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
