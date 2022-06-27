import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'InformationalTilesWebPartStrings';
import InformationalTiles from './components/InformationalTiles';
import { IInformationalTilesProps } from './components/IInformationalTilesProps';

export interface IInformationalTilesWebPartProps {
 
}

export default class InformationalTilesWebPart extends BaseClientSideWebPart<IInformationalTilesWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IInformationalTilesProps> = React.createElement(
      InformationalTiles,
      {
        context: this.context
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

}
