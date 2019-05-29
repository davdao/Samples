import { SPHttpClient, SPHttpClientResponse, ISPHttpClientConfiguration, ODataVersion, SPHttpClientConfiguration } from '@microsoft/sp-http';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { ISiteModel } from './SiteModel';
import { getInitials } from '../common/utils';

const siteNameSelect = 'Color,TileColor,Title,SiteLogo,ModifiedBy,LastModifiedBy,FileExtension,FileType,Path,SiteName,SiteTitle,PictureThumbnailURL,DefaultEncodingURL,LastModifiedTime,ListID,ListItemID,SiteID,WebId,UniqueID,GroupID';
const searchFilter = '(contentclass:STS_Web OR contentclass:STS_Site) AND (-SiteTemplateId:21 AND -webtemplate:APP AND -webtemplate:TEAMCHANNEL)';


export class DataServices {
    constructor(private context: IWebPartContext) {
        
    }

    public rowLimit = 10;
    public getSites(siteName: string) : Promise<any> {
        //Since the SP Search REST API works with ODataVersion 3, we have to create a new ISPHttpClientConfiguration object with defaultODataVersion = ODataVersion.v3
        const spSearchConfig: ISPHttpClientConfiguration = { defaultODataVersion: ODataVersion.v3 };
        //Override the default ODataVersion.v4 flag with the ODataVersion.v3
        const clientConfigODataV3: SPHttpClientConfiguration = SPHttpClient.configurations.v1.overrideWith(spSearchConfig);

        return new Promise<any>((resolve: (any) => void, reject: (error: any) => void): void => {
            this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/search/query?querytext='Title:"${siteName}" AND ${searchFilter}'&selectproperties='${siteNameSelect}'&rowlimit=${this.rowLimit}`,
                clientConfigODataV3
            )
            .then((response: SPHttpClientResponse): Promise<any> => {
                return response.json();
            })
            .then((result): void => {
                if(result.PrimaryQueryResult.RelevantResults.RowCount > 0) {
                    let siteItems: ISiteModel[] = [];
                    //We convert the result
                    let results: any[] = result.PrimaryQueryResult.RelevantResults.Table.Rows;
                    for (let l = 0; l < results.length; l++) {
                        var cells = results[l].Cells;
                        var cell = {};
                        for (let m = 0; m < cells.length; m++) {
                            cell[cells[m].Key] = cells[m].Value;
                        }
                        siteItems.push({
                            Color: cell['Color'],
                            TileColor: cell['TileColor'],
                            Title: cell['Title'],
                            SiteLogo: cell['SiteLogo'],
                            Path: cell['Path'],
                            SiteName: cell['SiteName'],
                            SiteTitle: cell['SiteTitle'],
                            WebId: cell['WebId'],
                            Selected: false,
                            Acronyms: getInitials(cell['Title'], false, false)
                        });
                    }
                    resolve(siteItems);
                }
                else{
                    resolve([]);
                }
                
            }, (error: any): void => {
                reject(error);
            });
        });
    }
}