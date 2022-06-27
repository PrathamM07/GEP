import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'HomeTilesWebPartStrings';
import HomeTiles from './components/HomeTiles';
import { IHomeTilesProps } from './components/IHomeTilesProps';

export interface IHomeTilesWebPartProps {
  Title: string;
  TileCategory: string;
  PlayIconUrl: string;
  HeadingIconUrl: string;
}

export default class HomeTilesWebPart extends BaseClientSideWebPart<IHomeTilesWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IHomeTilesProps> = React.createElement(
      HomeTiles,
      {
        Title: this.properties.Title,
        context: this.context,
        PlayIconUrl: this.properties.PlayIconUrl,
        TileCategory: this.properties.TileCategory,
        HeadingIconUrl: this.properties.HeadingIconUrl
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
                PropertyPaneTextField("Title",{
                  label:"Title"
                }),

                PropertyPaneTextField("TileCategory",{
                  label:"Tile Category"
                }),

                PropertyPaneTextField("PlayIconUrl",{
                  label:"Play Icon Relative Url"
                }),

                PropertyPaneTextField("HeadingIconUrl",{
                  label:"Heading Icon Relative Url"
                })

              ]
            }
          ]
        }
      ]
    };
  }
}
