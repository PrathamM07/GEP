import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'PromotionalTilesWebPartStrings';
import PromotionalTiles from './components/PromotionalTiles';
import { IPromotionalTilesProps } from './components/IPromotionalTilesProps';

export interface IPromotionalTilesWebPartProps {
 
}

export default class PromotionalTilesWebPart extends BaseClientSideWebPart<IPromotionalTilesWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IPromotionalTilesProps> = React.createElement(
      PromotionalTiles,
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
