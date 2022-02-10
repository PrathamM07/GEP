import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'RadioSpotsWebPartStrings';
import RadioSpots from './components/RadioSpots';
import { IRadioSpotsProps } from './components/IRadioSpotsProps';

export interface IRadioSpotsWebPartProps {
  description: string;
  apiURL: string;
  webpartname: string;
  dropdownTitle: string;
  dropdowncontent:string;
  color: string;
  videolink:string;
  audiolink:string;
}

export default class RadioSpotsWebPart extends BaseClientSideWebPart<IRadioSpotsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IRadioSpotsProps> = React.createElement(
      RadioSpots,
      {
        description: this.properties.description,
        context: this.context,
        apiURL: this.properties.apiURL ? this.properties.apiURL : "",
        webparttitle: this.properties.webpartname ? this.properties.webpartname : "",
        buttonColor: this.properties.color ? this.properties.color : "#0083cf",
        video:this.properties.videolink?this.properties.videolink:"",
        audio:this.properties.audiolink?this.properties.audiolink:"",
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
