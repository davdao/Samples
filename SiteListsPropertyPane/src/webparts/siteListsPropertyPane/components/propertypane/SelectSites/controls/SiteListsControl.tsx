import * as React from 'react';
import { ISiteModel } from '../../../../common/SiteModel';
import styles from '../../../SiteListsPropertyPane.module.scss';
import SiteCheckBox from '../../../../common/htmlControl/SiteCheckBox';

export interface ISiteListsProps {
    siteList : ISiteModel[];
    onPropCheckedSite: (site) => void;
}

export interface ISiteListsState {
    
}

export default class SiteListsControl extends React.Component<ISiteListsProps, ISiteListsState> {
    constructor(props) {
        super(props);
    }

    public render(): React.ReactElement<ISiteListsProps> {

        return(<div className={styles.siteList}>
            {
                this.props.siteList.map((site) => {
                    return(<SiteCheckBox site={site} onCheckedSite={this.props.onPropCheckedSite.bind(this)}/>);                    
                })
            }</div>);
    }
}