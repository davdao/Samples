import * as React from 'react';
import * as strings from 'SiteListsPropertyPaneWebPartStrings';
import styles from '../../../SiteListsPropertyPane.module.scss';
import { ISiteModel } from '../../../../common/SiteModel';
import SiteCheckBox from '../../../../common/htmlControl/SiteCheckBox';

export interface ISiteListGroupProps {
    siteList : ISiteModel[];
    onPropCheckedSite: (site) => void;
}

export interface ISiteListGroupState {
    selectedSiteClicked: boolean;
}       

export default class SiteListGroup extends React.Component<ISiteListGroupProps, ISiteListGroupState> {
    constructor(props: ISiteListGroupProps) {
        super(props);

        this.state = {
            selectedSiteClicked: false
        };
    }

    public render(): React.ReactElement<ISiteListGroupProps> {
        return(<div>
                    <div>
                        <button className={styles.sectionHeader} onClick={() =>         this.setState({ selectedSiteClicked: !this.state.selectedSiteClicked })}>
                            <i className={styles.sectionIcon + ' ms-Icon ms-Icon--ChevronRight ' + (!this.state.selectedSiteClicked ? styles.sectionIconClicked : styles.sectionIconUnClicked)}></i>
                            <label className={styles.sectionLabel}>{this.props.siteList.length + " " + strings.PropertyPaneSelectedSite}</label>
                        </button>
                        <div className={styles.siteList}>
                        {
                            !this.state.selectedSiteClicked && this.props.siteList.map((site) => {
                                return(<SiteCheckBox site={site} onCheckedSite={this.props.onPropCheckedSite.bind(this)}/>);                                     
                            })
                        }
                        </div>
                    </div>
                </div>);
    }
}