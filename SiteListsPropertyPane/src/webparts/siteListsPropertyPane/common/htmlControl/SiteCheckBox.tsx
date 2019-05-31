import * as React from 'react';
import { ISiteModel } from '../SiteModel';
import styles from './SiteCheckBox.module.scss';
import { defaultColor } from '../constants';

export interface ISiteCheckBoxProps {
    site : ISiteModel;
    onCheckedSite: (site) => void;
}

export default class SiteCheckBox extends React.Component<ISiteCheckBoxProps, {}> {
    constructor(props) {
        super(props);
    }

    public render(): React.ReactElement<ISiteCheckBoxProps> {
        return(
            <div className={styles.checkBoxItem} onClick={() => {this.props.onCheckedSite(this.props.site.Path); } }>
                <div className={styles.checkBoxDiv}>
                    <input type="checkbox" className={styles.chkBox} checked={this.props.site.Selected} />
                </div>
                <div className={styles.bannerImage} style={
                        this.props.site.SiteLogo ? {backgroundImage : `url("${this.props.site.SiteLogo}")` }
                        :
                        {backgroundColor: (this.props.site.Color ? this.props.site.Color : defaultColor ) }
                    }>{this.props.site.SiteLogo ? '' : this.props.site.Acronyms}</div>
                <div className={styles.bannerTitle} title={this.props.site.Title}>{this.props.site.Title}</div>
            </div>
        );
    }

}