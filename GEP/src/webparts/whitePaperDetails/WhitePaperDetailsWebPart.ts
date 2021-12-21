import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneSlider,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'WhitePaperDetailsWebPartStrings';
import WhitePaperDetails from './components/WhitePaperDetails';
import { IWhitePaperDetailsProps } from './components/IWhitePaperDetailsProps';

import {
  HttpClient,
  HttpClientResponse
}from '@microsoft/sp-http';


export interface IWhitePaperDetailsWebPartProps {
  description: string;
apiURL: string;
sliderproperty: number;
maxItem:number;
  
}

export default class WhitePaperDetailsWebPart extends BaseClientSideWebPart<IWhitePaperDetailsWebPartProps> {

  public maxItem = 5;
  public render(): void {
  
    const element: React.ReactElement<IWhitePaperDetailsProps> = React.createElement(
      WhitePaperDetails,
      {
        description: this.properties.description,
        context:this.context,
      
        maxItem: this.properties.sliderproperty ? this.properties.sliderproperty : 22,
        apiURL: this.properties.apiURL? this.properties.apiURL:"https://webdev.gep.com/WhitePaperList"
      } 
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('apiURL', {
                  label: "News API URL"
                }),
                 
              
                
                PropertyPaneSlider('sliderproperty', {
                  label: "Max Items",
                  min: 1,
                  max: 22,
                  showValue: true,
                  value: this.maxItem
                })
            
              ]
            }
          ]
        }
      ]
    };
  }
}
