import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IPropertyPaneField, IPropertyPaneCustomFieldProps, PropertyPaneFieldType } from '@microsoft/sp-property-pane';
import SelectSiteListControl, { ISelectSiteListControlProps } from './controls/SelectSiteListControl';
import { ISiteModel } from '../../../common/SiteModel';

export interface IPropertyPropertyPaneSelectSitesProps {
    key: string;
    properties: any;
    _context: any;
    selectedSitesProperties: ISiteModel[];
    onPropertyChange: ((selectedSites: ISiteModel[]) => void);
}

export interface PropertyPaneSelectSitesProps extends IPropertyPropertyPaneSelectSitesProps, IPropertyPaneCustomFieldProps {

}

export default class PropertyPaneSelectSites implements IPropertyPaneField<IPropertyPropertyPaneSelectSitesProps> {
    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public properties: PropertyPaneSelectSitesProps;
    private elem: HTMLElement; 

    constructor(targetProperty: string, properties: IPropertyPropertyPaneSelectSitesProps) {
        this.targetProperty = targetProperty;
        this.properties = {
            key: properties.key,
            properties: properties.properties,
            _context: properties._context,
            onRender: this.onRender.bind(this),
            selectedSitesProperties: properties.selectedSitesProperties,
            onPropertyChange: properties.onPropertyChange
        };
    }

    public render(): void {
        if (!this.elem) {
            return;
        }
        this.onRender(this.elem);
    }

    private onRender(elem: HTMLElement): void {
        if (!this.elem) {
            this.elem = elem;
        }

        const element: React.ReactElement<ISelectSiteListControlProps> = React.createElement(SelectSiteListControl, {
            context: this.properties._context,
            selectedSitesProperties: this.properties.selectedSitesProperties,
            onSelectedSiteChange: this.properties.onPropertyChange
        });

        ReactDom.render(element, elem);
    }
}