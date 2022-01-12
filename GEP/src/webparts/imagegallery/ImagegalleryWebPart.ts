import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ImagegalleryWebPartStrings';
import Imagegallery from './components/Imagegallery';
import { IImagegalleryProps } from './components/IImagegalleryProps';

export interface IImagegalleryWebPartProps {
  description: string;
  apiURL: string;
  sliderproperty: number;
  webpartname: string;
  dropdownTitle: string;
  color: string;
}

export default class ImagegalleryWebPart extends BaseClientSideWebPart<IImagegalleryWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IImagegalleryProps> = React.createElement(
      Imagegallery,
      {
        description: this.properties.description,
        context: this.context,
        assettype: this.properties.dropdownTitle ? this.properties.dropdownTitle : "White Papers",
        maxItem: this.properties.sliderproperty ? this.properties.sliderproperty : 8,
        apiURL: this.properties.apiURL ? this.properties.apiURL :"",
        webparttitle: this.properties.webpartname ? this.properties.webpartname : "",
        buttonColor: this.properties.color ? this.properties.color : "#0083cf",
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
