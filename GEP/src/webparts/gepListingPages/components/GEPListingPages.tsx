import * as React from 'react';
import styles from './GEPListingPages.module.scss';
import {IGEPListingPagesProps } from './IGEPListingPagesProps';
import { escape } from '@microsoft/sp-lodash-subset';
import axios from "axios";
import GDService from '../../../Services/GetDataService';
import { Web } from '@pnp/sp/presets/all';
import './../../../Frameworks/common/css/bootstrap.min.css';
import './Body.css';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IAllItems } from '../../../Services/IListOperation';

export interface IGEPListingPagesStates {

  list: IPageItem[];
  currentPageItems: IPageItem[];
  totalPages: number;
  items: IPageItem[];
  currentPage: number;
  //assettype:string;
}
export interface IPageItem {
  service_title: string;
  image_url: string;
  description: string;
  title_alias: string;
 
}

let listItems: any[] = [];
export default class GEPListingPages extends React.Component<IGEPListingPagesProps, IGEPListingPagesStates> {

  public _ops: GDService;
  private ServiceInatance: GDService;

  public tempPageItems: IPageItem[] = [];

  public constructor(props: IGEPListingPagesProps, state: IGEPListingPagesStates) {

    super(props);

    this.state = {
      list: [],
      currentPageItems: [],
      totalPages: 5,
      items: [],
      currentPage: 5,
      //assettype: []
    };
  }

  public componentDidMount() {
    this.getSitePageDetails();
  }

  public render(): React.ReactElement<IGEPListingPagesProps> {
    var titlealias = window.location.protocol;
    console.log("**********", this.props.assettype);
    let str = this.props.webparttitle;
    str = str.replace(/\s+/g, '-').toLowerCase();
    console.log(str);
    let weburl=listItems[0];
   // console.log("str",listItems);
    return (
      <section className="section__content bg-white">
        <div className="container">
          <div className="row">
        
            {/* <div className="col-md-12">
                           <Link to={detailPage}><h2 className="heading"><img src={Img} alt="icon" className="icon"/> PROMOTIONAL CONTENT</h2></Link>
                            </div> */}
                             
            <div className="col-md-12">
              <a href={weburl + "/knowledge-bank/" + str} target="_blank" className="heading">
                {
                  (this.props.webparttitle == "") ?
                    <div className="heading">{this.props.assettype}</div>
                    :
                    <div className="heading">{this.props.webparttitle}</div>
                }

              </a>
            </div>

            {
              this.state.list.map((detail, index) => {
                let imgSrc = detail.image_url;
                return (
               //   <div key={index} className="col-12 col-lg-4 col-md-6 col-sm-6 col-xl-3">
               <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                  <div className="card">
 
                      <img src={imgSrc} alt="imageCard" className="imageCard" />
                      {/* {(props.play === '') ? '' : <img className="play" src={props.play} alt="playButton" onClick={play} />}
                  */}
                      <div className="imageContent row-no-padding">
                        <div className="row align-items-end">
                          <div className="col-9 col-md-9">
                            {/* <h3 className="mb-0">{detail.service_title}</h3> */}
                          </div>
                          {/* {(props.view === '') ? '' : */}

                          <div className="col-3 col-md-12">

                            <a href={weburl +"/"+ detail.title_alias} target="_blank" style={{ textDecoration: 'none' }} className="d-block">View More</a>
                            {/* <a href={pageItem.pageLink} className="read-more">{this.state.textArticleLabel}</a> */}
                          </div>
                          {/* //    } */}

                        </div>
                      </div>

                    </div>
                    <br></br>
                  </div>

                );
              })
            }


          </div>
        </div>
      </section>
    );
  }


  public async getSitePageDetails() {
    this.ServiceInatance = new GDService(this.props.context);
    let web = Web(`${this.props.context.pageContext.web.absoluteUrl}/`);
    //  let maxItems = this.props.maxItem ? this.props.maxItem : 5;
    const orderByQuery = { columnName: "Modified", ascending: false };
    const internalColumnName = ["AssetType/Title", "Url", "MethodName"];
    const expandColumnName = ["AssetType"];
    let filterQuery = `AssetType/Title eq '${this.props.assettype}'`;
    const ListDetails: IAllItems = {
      listName: "GepConfigurationList",
      selectQuery: internalColumnName.join(','),
      expandQuery: expandColumnName.join(','),
      filterQuery: filterQuery,
      // topQuery: parseInt(maxItems.toString()),
      // orderByQuery: orderByQuery
    };

    await this.ServiceInatance.getAllListItems(ListDetails).then((listData: any[]) => {

      if (listData && listData.length > 0) {
        console.log("ListDetails:", listData[0].Url);
        var url = listData[0].Url + "/" + listData[0].MethodName;
        var weburl=listData[0].Url;
        this.getDetails(url);
        listItems.push(weburl);
       // sp_url=listdata[0].Url;
      }
    
    }).catch((error) => {
      console.log(error);

    });
  }

  private async getDetails(url: string) {
    axios.get(url)
      .then((result) => {
        console.log('This is your data', result.data.data[2].list);
        this.setState({ list: result.data.data[2].list });
      }

      );
      }
}