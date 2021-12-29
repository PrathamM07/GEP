import * as React from 'react';
import styles from './WhitePaperDetails.module.scss';
import { IWhitePaperDetailsProps } from './IWhitePaperDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import axios from "axios";
import GDService from '../../../Services/GetDataService';
import { Web } from '@pnp/sp/presets/all';
import './../../../Frameworks/common/css/bootstrap.min.css';
import './Body.css';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IAllItems } from '../../../Services/IListOperation';
//import {TilesDetailPage} from './TilesDetailPage';

export interface IWhitePaperDetailsStates {

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
  Title: string;
  Image: string;
  ApiUrl:string;
  PageDetailUrl:string;
 
}

let listItems: any[] = [];
export default class WhitePaperDetails extends React.Component<IWhitePaperDetailsProps, IWhitePaperDetailsStates> {

  public _ops: GDService;
  private ServiceInatance: GDService;

  public tempPageItems: IPageItem[] = [];

  public constructor(props: IWhitePaperDetailsProps, state: IWhitePaperDetailsStates) {

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
   
    this.getPromotionalDetails();
   // this.getSitePageDetails();
  }

  public render(): React.ReactElement<IWhitePaperDetailsProps> {
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
                   // <div className="heading">{this.props.assettype}</div>
                   <div className="heading">PROMOTIONAL CONTENT</div>
                    :
                    <div className="heading">INFORMATIONAL CONTENT</div>
                   // <div className="heading">{this.props.webparttitle}</div>
                }

              </a>
            </div>

            {
              this.state.list.slice(0, this.props.maxItem).map((detail, index) => {
                let imgSrc = detail.Image;//detail.image_url;
                return (
                  
               //   <div key={index} className="col-12 col-lg-4 col-md-6 col-sm-6 col-xl-3">
               <div key={index} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3">
                  <div className="card">
                 
                      <img src= {JSON.parse(imgSrc).serverRelativeUrl} alt="imageCard" className="imageCard" />
                      {/* {(props.play === '') ? '' : <img className="play" src={props.play} alt="playButton" onClick={play} />}
                  */}
                      <div className="imageContent row-no-padding">
                        <div className="row align-items-end">
                          <div className="col-9 col-md-9">
                          <h3 className="mb-0">{detail.Title}</h3>
                          </div>
                          {/* {(props.view === '') ? '' : */}

                          <div className="col-3 col-md-12">
                            
                          {/* <Link to='./TilesDetailPage' target='_blank'><a><h2 className="d-block">View All</h2></a></Link> */}
                             <a href={detail.PageDetailUrl} target="_blank" style={{ textDecoration: 'none' }} className="d-block">View All</a> 
                            {/*<a href={pageItem.pageLink} className="read-more">{this.state.textArticleLabel}</a> */}
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



  public async getPromotionalDetails() {

    this.ServiceInatance = new GDService(this.props.context);

    const internalColumnName = ["Title","Image","ApiUrl","PageDetailUrl"];
   // let maxItems = this.props.maxItems;
    let web = Web(`${this.props.context.pageContext.web.absoluteUrl}/`);
    const SitePagesList: IAllItems = {
      listName: 'InformationalContentList',
      selectQuery: internalColumnName.join(','),
      // expandQuery: expandColumnName.join(','),
     // topQuery: parseInt(maxItems),
      // filterQuery: filterQuery
    };
    await this.ServiceInatance.getAllListItems(SitePagesList).then((pageData) => {

      if (pageData && pageData.length > 0) {
        console.log("promotional data is >>>>>>>>>>>>>", pageData);
        this.setState({ list: pageData });

var listdata=pageData;
        this.getData(listdata.toString());

      
        //this.mapPageData(pageData, web);
      }
    }).catch((error) => {
      console.log(error);

    });
  }
  private async getData(data: string) {
    axios.get(data)
      .then((result) => {
        console.log('This is your data', result.data);
       // this.setState({ list: result.data.data[2].list });
      }

      );
      }
 
  // public async getSitePageDetails() {
  //   this.ServiceInatance = new GDService(this.props.context);
  //   let web = Web(`${this.props.context.pageContext.web.absoluteUrl}/`);
  //   //  let maxItems = this.props.maxItem ? this.props.maxItem : 5;
  //   const orderByQuery = { columnName: "Modified", ascending: false };
  //   const internalColumnName = ["AssetType/Title", "Url", "MethodName"];
  //   const expandColumnName = ["AssetType"];
  //   let filterQuery = `AssetType/Title eq '${this.props.assettype}'`;
  //   const ListDetails: IAllItems = {
  //     listName: "GepConfigurationList",
  //     selectQuery: internalColumnName.join(','),
  //     expandQuery: expandColumnName.join(','),
  //     filterQuery: filterQuery,
  //     // topQuery: parseInt(maxItems.toString()),
  //     // orderByQuery: orderByQuery
  //   };

  //   await this.ServiceInatance.getAllListItems(ListDetails).then((listData: any[]) => {

  //     if (listData && listData.length > 0) {
  //       console.log("ListDetails:", listData[0].Url);
  //       var url = listData[0].Url + "/" + listData[0].MethodName;
  //       var weburl=listData[0].Url;
  //       this.getDetails(url);
  //       listItems.push(weburl);
  //      // sp_url=listdata[0].Url;
  //     }
    
  //   }).catch((error) => {
  //     console.log(error);

  //   });
  // }

//   private async getDetails(url: string) {
//     axios.get(url)
//       .then((result) => {
//         console.log('This is your data', result.data.data[2].list);
//         this.setState({ list: result.data.data[2].list });
//       }

//       );
//       }
}
