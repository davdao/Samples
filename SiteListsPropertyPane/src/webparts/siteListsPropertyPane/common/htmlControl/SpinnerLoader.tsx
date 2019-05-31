import * as React from 'react';
import styles from './SpinnerLoader.module.scss';
import { Component } from 'react';

export default class SpinnerLoader extends Component {
    public render() {
        return(<div className={styles.customLoader}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>);
    }
}