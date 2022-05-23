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
import * as strings from 'GepListingPageWebPartStrings';
import GepListingPage from './components/GepListingPage';
import { IGepListingPageProps } from './components/IGepListingPageProps';
import { sp } from '@pnp/sp';
import { Web } from '@pnp/sp/presets/all';
export interface IGepListingPageWebPartProps {
  description: string;
  apiURL: string;
  sliderproperty: number;
  webpartname: string;
  dropdownTitle: string;
  color: string;
  descriptioncharacterlimit: number;
}
var propertypaneitem = [];

export default class GepListingPageWebPart extends BaseClientSideWebPart<IGepListingPageWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IGepListingPageProps> = React.createElement(
      GepListingPage,
      {
        description: this.properties.description,
        context: this.context,
        assettype: this.properties.dropdownTitle ? this.properties.dropdownTitle : "White Papers",
        maxItem: this.properties.sliderproperty ? this.properties.sliderproperty : 8,
        apiURL: this.properties.apiURL ? this.properties.apiURL :"https://webdev.gep.com/",
        webparttitle: this.properties.webpartname ? this.properties.webpartname : "",
        buttonColor: this.properties.color ? this.properties.color : "#0083cf",
        descriptionlength: this.properties.descriptioncharacterlimit ? this.properties.descriptioncharacterlimit : 50,
      }
    );  
    ReactDom.render(element, this.domElement);
  }
  protected get disableReactivePropertyChanges(): boolean {
    return true;
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
                PropertyPaneTextField('apiURL', {
                  label: "News API URL",
                  placeholder: "https://webdev.gep.com/",
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}

