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
import WhitePaperDetails from './components/WhitePaperDetails';
import { IWhitePaperDetailsProps } from './components/IWhitePaperDetailsProps';
import { sp } from '@pnp/sp';
import { Web } from '@pnp/sp/presets/all';

export interface IWhitePaperDetailsWebPartProps {
  description: string;
  apiURL: string;
  sliderproperty: number;
  webpartname: string;
  dropdownTitle: string;
  dropdowncontent:string;
  color: string;
  
}

var propertypaneitem = [];
export default class WhitePaperDetailsWebPart extends BaseClientSideWebPart<IWhitePaperDetailsWebPartProps> {

  private _listFields: IPropertyPaneDropdownOption[] = [];

  public render(): void {

    const element: React.ReactElement<IWhitePaperDetailsProps> = React.createElement(
      WhitePaperDetails,
      {
        description: this.properties.description,
        context: this.context,
        assettype: this.properties.dropdownTitle ? this.properties.dropdownTitle : "White Papers",
        maxItem: this.properties.sliderproperty ? this.properties.sliderproperty : 8,
        apiURL: this.properties.apiURL ? this.properties.apiURL : "",
        webparttitle: this.properties.webpartname ? this.properties.webpartname : "",
        contenttype:this.properties.dropdowncontent?this.properties.dropdowncontent:"Promotional Content",
        buttonColor: this.properties.color ? this.properties.color : "#0083cf",
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
    web.lists.getByTitle("Contents").items.select(columnName.join(',')).get().then((data) => {
      for (var assettype in data) {
        items.push({ key: data[assettype].Title, text: data[assettype].Title });
      }
      console.log(items);
      propertypaneitem = items;
     
    });
    
  }

  protected get disableReactivePropertyChanges(): boolean {
    this.render();
    this.getPropertyPaneValue();
    return true;
    
    }
  // protected onDispose(): void {
  //   ReactDom.unmountComponentAtNode(this.domElement);
  // }

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


                // PropertyPaneTextField('webpartname', {
                //   label: "Webpart Label",
                // }),
                PropertyPaneDropdown('dropdowncontent', {
                  label: 'Choose Page Content',
                   options: propertypaneitem,
                   selectedKey: "Promotional Content",
                                
                }),
              
                // PropertyPaneTextField('apiURL', {
                //   label: "News API URL"
                // }),
                // PropertyPaneSlider('sliderproperty', {
                //   label: "Max Items",
                //   min: 1,
                //   max: 8,
                //   showValue: true,
                //   value: 8,
                //   step: 1
                // }),

                // PropertyPaneDropdown('dropdownTitle', {
                //   label: 'Choose the Asset Type',
                //   options: propertypaneitem,
                //   selectedKey: "White Papers"
                // }),
              ]
            }
          ]
        }
      ]
    };
  }
}
