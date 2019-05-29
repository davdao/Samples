import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration, PropertyPaneTextField, IPropertyPaneField, PropertyPaneDropdown } from '@microsoft/sp-property-pane';
import PropertyPaneSelectSites from './components/propertypane/SelectSites/PropertyPaneSelectSites';
import * as strings from 'SiteListsPropertyPaneWebPartStrings';
import SiteListsPropertyPane, { ISiteListsPropertyPaneProps } from './components/SiteListsPropertyPane';
import { sourceOptions, SourceType } from './common/constants';
import { ISiteModel } from './common/SiteModel';

export interface ISiteListsPropertyPaneWebPartProps {
  description: string;
  elementType: SourceType;
  selectedSitesProperties: ISiteModel[];
}

export default class SiteListsPropertyPaneWebPart extends BaseClientSideWebPart<ISiteListsPropertyPaneWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISiteListsPropertyPaneProps> = React.createElement(
      SiteListsPropertyPane,
      {
        selectedSitesProperties: this.properties.selectedSitesProperties || [],
        sourceType: this.properties.elementType
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
              groupFields: this._getSiteListDisplay()
            }
          ]
        }
      ]
    };
  }

  private _getSiteListDisplay(): IPropertyPaneField<any>[] {
    const fields: IPropertyPaneField<any>[] = [];
    fields.push(PropertyPaneDropdown('elementType', { label: strings.PropertyPaneSiteListType, options: sourceOptions} ));

    if(this.properties.elementType == SourceType.SelectSites)
      fields.push(new PropertyPaneSelectSites('selectedSitesList', { 
        key: 'selectedSitesList', 
        properties: this.properties, 
        _context: this.context,
        selectedSitesProperties: this.properties.selectedSitesProperties,
        onPropertyChange: (selectedSites: ISiteModel[]) => {
          this.properties.selectedSitesProperties = selectedSites;
          this.render();
          this.context.propertyPane.refresh();
        }
      }));

    return fields;
  }
}
