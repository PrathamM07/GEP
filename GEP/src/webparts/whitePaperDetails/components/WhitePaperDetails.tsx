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
import GepListingPage from '../../gepListingPage/components/GepListingPage';
import { DetailsList } from 'office-ui-fabric-react';
//import {TilesDetailPage} from './TilesDetailPage';

 
export interface IWhitePaperDetailsStates {

  list: IPageItem[];
  currentPageItems: IPageItem[];
  totalPages: number;
  items: IPageItem[];
  currentPage: number;
  dynamicUrl:string;
  
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
      dynamicUrl:"" ,
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
               // console.log("detailpage",detail.PageDetailUrl);
                var title=(detail.Title).replace(" ","");
                console.log("Title name is",title);
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
                            
                            {/* <a onClick={this.sendData.bind(detail.PageDetailUrl)} target="_blank" style={{ textDecoration: 'none' }} className="d-block">View All</a>  */}
                             {/* <a href={`https://prathameshneo.sharepoint.com/sites/GEP/SitePages/GepListing-Page.aspx?category=${detail.Title}`} target="_blank" style={{ textDecoration: 'none' }} className="d-block">View All</a>  */}
                             <a href="javascript:void(0);" target="_blank" style={{ textDecoration: 'none' }} className="d-block" onClick={(e) => { e.preventDefault(); window.open(`https://prathameshneo.sharepoint.com/sites/GEP/SitePages/GepListing-Page.aspx?category=${title}`); return false; }}>View all</a>
                            
                             {/* <GepListingPage apiURL ={this.handleCallback} assettype='' maxItem={0} webparttitle='' >View All</GepListingPage> */}
                         
                          
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
 
 
}
