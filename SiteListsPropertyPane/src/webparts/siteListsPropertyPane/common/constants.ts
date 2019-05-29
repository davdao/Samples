import * as strings from 'SiteListsPropertyPaneWebPartStrings';

export const defaultColor = '#53565a';
export enum SourceType {
    ThisSite = 1,
    AllSites = 2,
    SelectSites = 3,
}

export const sourceOptions = [
    { key: SourceType.ThisSite, text: strings.PropertyPaneSiteListTypeThisSite },
    { key: SourceType.AllSites, text: strings.PropertyPaneSiteListTypeAllSite },
    { key: SourceType.SelectSites, text: strings.PropertyPaneSiteListTypeSelectSite }
];