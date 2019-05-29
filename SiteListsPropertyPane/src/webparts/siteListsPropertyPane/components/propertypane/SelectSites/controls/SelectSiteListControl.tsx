import * as React from 'react';
import * as strings from 'SiteListsPropertyPaneWebPartStrings';
import { DataServices } from '../../../../common/DataServices';
import SiteListsControl  from './SiteListsControl';
import SiteListGroup from './SiteListGroup';
import { ISiteModel } from '../../../../common/SiteModel';
import SpinnerLoader from './SpinnerLoader';
import styles from '../../../SiteListsPropertyPane.module.scss';
import { debounce } from '@microsoft/sp-lodash-subset';

export interface ISelectSiteListControlProps {
    context: any;
    selectedSitesProperties: ISiteModel[];
    onSelectedSiteChange: ((selectedSites: ISiteModel[]) => void);
}

export interface ISelectSiteListControlState {
    siteTitle: string;
    isLoading: boolean;
    siteList: ISiteModel[];
    loadingSuccess: boolean;
}       

export default class SelectSiteListControl extends React.Component<ISelectSiteListControlProps, ISelectSiteListControlState> {
    constructor(props: ISelectSiteListControlProps) {
        super(props);

        this.state = {
            siteTitle: '',
            isLoading: false,
            siteList: this.props.selectedSitesProperties || [],
            loadingSuccess: true
        };
        this.loadSites = debounce(this.loadSites, 1000); 
    }

    public render(): React.ReactElement<ISelectSiteListControlProps> {
        return (<div>
            <input  type="search" 
                    className={styles.searchbox}
                    placeholder={strings.PropertyPaneSiteListSearchSite}
                    onChange={(newValue) => this.setState({siteTitle:newValue.currentTarget.value, isLoading: true}, () => { if(newValue) this.loadSites(this.state.siteTitle); })}
                    />
            {
                this.state.isLoading && this.state.siteTitle ?
                    <SpinnerLoader />
                :
                    !this.state.siteTitle ?
                        <SiteListGroup siteList={this.state.siteList.filter(u => u.Selected)}  onPropCheckedSite={this.checkedSite.bind(this)} />
                    :
                        this.state.loadingSuccess ?
                            <SiteListsControl siteList={this.state.siteList} onPropCheckedSite={this.checkedSite.bind(this)} />
                        : <span>{strings.PropertyPaneSitesNotFound}</span>
            }
            
            
            </div>);
    }

    private checkedSite(webId: string) {
        let listToUpdate = this.state.siteList;
        let itemToUpdate = listToUpdate.filter(u => u.WebId === webId);
        if(itemToUpdate.length > 0) {
            itemToUpdate[0].Selected = !itemToUpdate[0].Selected;
        }

        this.setState({ siteList: listToUpdate }, () => {
            this.props.onSelectedSiteChange(this.state.siteList.filter(u => u.Selected));
        });
    }
    private loadSites (siteTitle: string) {
        const dataService = new DataServices(this.props.context);

        dataService.getSites(siteTitle).then(((sites:ISiteModel[]) => { 
            if(sites.length === 0) {
                this.setState({ isLoading: false, loadingSuccess: false }); 
            }
            else if(this.state.siteList.length === 0)
                this.setState({ siteList: sites, isLoading: false, loadingSuccess: true }); 
            else {
                let selectedSite : ISiteModel[] = this.state.siteList.filter(u => u.Selected);
                let nbSiteToGet = dataService.rowLimit - selectedSite.length;

                if(nbSiteToGet > 0) {
                    let siteToConcat = sites.filter((site, index) => {
                        if(index < nbSiteToGet-1 && selectedSite.filter(u => u.WebId === site.WebId).length === 0)
                            return true;
                        else
                            return false;
                    });
                    selectedSite = selectedSite.concat(siteToConcat);
                }
                this.setState({ siteList: selectedSite, isLoading: false, loadingSuccess: true });
            }
        }));
    }
}