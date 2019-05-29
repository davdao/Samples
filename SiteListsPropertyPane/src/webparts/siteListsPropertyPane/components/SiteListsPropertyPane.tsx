import * as React from 'react';
import { ISiteModel } from '../common/SiteModel';
import { SourceType } from '../common/constants';

export interface ISiteListsPropertyPaneProps {
    selectedSitesProperties: ISiteModel[];
    sourceType: SourceType;
}

export interface ISiteListsPropertyPaneState {
 
}       


export default class SiteListsPropertyPane extends React.Component<ISiteListsPropertyPaneProps, ISiteListsPropertyPaneState> {

    public render(): React.ReactElement<ISiteListsPropertyPaneProps> {
        switch(this.props.sourceType)
            {
                case SourceType.ThisSite:
                        return(<div>{'Request for this current site'}</div>);
                break;
                case SourceType.AllSites:
                        return(<div>{'Request for all sharepoint sites'}</div>);
                break;
                case SourceType.SelectSites:
                        return(<div><div>{'Request for selected sites : '}</div><div>
                            {
                                this.props.selectedSitesProperties.map((site) => {
                                    return(<div>{"selected sites : " + site.Title + " " + site.WebId}</div>);
                                })
                            }
                            </div></div>);
                break;
            } 
        
    }
}