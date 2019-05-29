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
    searchSiteList: ISiteModel[];
    loadingSuccess: boolean;
}       

export default class SelectSiteListControl extends React.Component<ISelectSiteListControlProps, ISelectSiteListControlState> {
    constructor(props: ISelectSiteListControlProps) {
        super(props);

        this.state = {
            siteTitle: '',
            isLoading: false,
            siteList: this.props.selectedSitesProperties || [],
            searchSiteList: [],
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
                        <SiteListGroup siteList={this.state.siteList}  onPropCheckedSite={this.checkedSite.bind(this)} />
                    :
                        this.state.loadingSuccess ?
                            <SiteListsControl siteList={this.state.searchSiteList} onPropCheckedSite={this.checkedSite.bind(this)} />
                        : <span>{strings.PropertyPaneSitesNotFound}</span>
            }
            
            
            </div>);
    }

    private checkedSite(webId: string) {
        let listToUpdate = this.state.siteList;
        let itemToUpdate = this.state.siteList.filter(u => u.WebId === webId);

        //If item exist
        if(itemToUpdate.length > 0) {
            itemToUpdate[0].Selected = !itemToUpdate[0].Selected;                
            //We update the search list
            let itemToAdd : ISiteModel = this.state.searchSiteList.filter(u => u.WebId === webId)[0];
            itemToAdd.Selected = false;
        }
        //If not we add to current list
        else{
            let itemToAdd : ISiteModel = this.state.searchSiteList.filter(u => u.WebId === webId)[0];
            itemToAdd.Selected = true;
            listToUpdate = listToUpdate.concat(itemToAdd);
        }

        this.setState({ siteList: listToUpdate.filter(u => u.Selected)}, () => {
            this.props.onSelectedSiteChange(this.state.siteList);
        });
    }
    private loadSites (siteTitle: string) {
        const dataService = new DataServices(this.props.context);

        dataService.getSites(siteTitle).then(((sites:ISiteModel[]) => { 
            if(sites.length === 0) {
                this.setState({ isLoading: false, loadingSuccess: false }); 
            }
            else if(this.state.siteList.length === 0)
                this.setState({ searchSiteList: sites, isLoading: false, loadingSuccess: true }); 
            else {
                let selectedSite = sites.map((site:ISiteModel) => {
                    if(this.state.siteList.filter(u => u.WebId == site.WebId).length > 0) 
                        site.Selected = true;
                    return site; 
                });

                this.setState({ searchSiteList: selectedSite, isLoading: false, loadingSuccess: true });
            }
        }));
    }
}