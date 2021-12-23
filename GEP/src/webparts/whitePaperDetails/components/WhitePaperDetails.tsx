import * as React from 'react';
import styles from './WhitePaperDetails.module.scss';
import { IWhitePaperDetailsProps } from './IWhitePaperDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import axios from "axios";
import GDService from '../../../Services/GetDataService';
import { Web } from "@pnp/sp/webs";

import './../../../Frameworks/common/css/bootstrap.min.css';
import './body.css'
import { Pagination } from './Pagination';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
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
}


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
    this.getDetails();
  }
  // const handler = (event) => {
  //     console.log(event.currentTarget.dataset.index);
  // };
  public render(): React.ReactElement<IWhitePaperDetailsProps> {
    var titlealias = window.location.protocol;
    
   // this._ops = this.props.context.serviceScope.consume(GDService.serviceKey);
    console.log("**********", this.props.assettype);
    let str = this.props.webparttitle;
    str = str.replace(/\s+/g, '-').toLowerCase();
    console.log(str);
    return (
      <section className="section__content bg-white">
        <div className="container">
          <div className="row">
          {/* <div className="col-md-12">
                           <Link to={detailPage}><h2 className="heading"><img src={Img} alt="icon" className="icon"/> PROMOTIONAL CONTENT</h2></Link>
                            </div> */}
            <div className="col-md-12">
              <a href={"https://webdev.gep.com/" + "knowledge-bank/" + str} target="_blank" className="heading">{this.props.webparttitle}</a>
            </div>

            {
              this.state.list.slice(0, this.props.maxItem).map((detail, index) => {
                let imgSrc = detail.image_url;
                // console.log("dipika>>>>>>>>>>>>>>>",detail.title_alias);
                return (
                  <div key={index} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3">
                    <div className="card" >

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

                            <a href={"https://webdev.gep.com/" + detail.title_alias} target="_blank" style={{ textDecoration: 'none' }} className="d-block">View More</a>
                            {/* <a href={pageItem.pageLink} className="read-more">{this.state.textArticleLabel}</a> */}
                          </div>
                          {/* //    } */}

                        </div>
                      </div>


                      {/* <div className="video-popup">
                    <div className="video-popup__inner">
                      <span className="close__button" onClick={closeButton}>&times;</span>
                      <div className="video-con">
                      </div>
                    </div>
                  </div> */}

                    </div>
                    <br></br>
                  </div>

                )
              })
            }
            {/* <div className="list-paging">
          <Pagination
            currentPage={this.state.currentPage}
            totalPages={this.state.totalPages}
            onChange={(page) => this.pagination(page, this.state.items)}
            limiter={3} // Optional - default value 3
          />
        </div> */}

          </div>
        </div>
      </section>
    )
  }

  // public pagination(crntPage, libraryData) {
  //   var startCount = (crntPage - 1) * viewCount;
  //   var endCount = crntPage * viewCount;
  //   let pagedArr = libraryData.slice(startCount, endCount);
  //   this.setState({
  //     currentPage: 1
  //   });
  //   //return pagedArr;
  //   let web = Web(`${this.props.context.pageContext.web.absoluteUrl}/`);
  //   this.mapPageData(pagedArr, web);
  // }
  private async getDetails(){
   
  let web = Web(`${this.props.context.pageContext.web.absoluteUrl}/`);
  const columnName = ["Url","AssetType/Title"];
 
   let filterQuery = `AssetType/Title eq '${this.props.assettype}'`;
    const expandColumnName = ["AssetType"];

   let data = sp.web.lists.getByTitle("Configuration List").items
    .filter(filterQuery ? filterQuery : '')
   .select("Url","AssetType/Title")
   .expand("AssetType").get();
  
  let result=data;
   console.log("List result is",result);
  


  // this._ops
  // .getListDatas(
  //   "AssetType",
  //   "Title"
  // )
  // .then((data) => {
  //   if (data) this.setState({ list: data });
  //   console.log("List result is",data);
  // });
  axios.get(this.props.apiURL)
      .then((result) => {
        console.log('This is your data', result.data.data[2].list)
        this.setState({ list: result.data.data[2].list });


      }

     );
 


}

  // this.props.context.spHttpClient.get(this.props.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Employee')/items(${id})`,
      

 //.expand(Item.expandQuery ? Item.expandQuery : '')
    //const columnName = ["Title", "PageCategory/Title", "PageReadTime", "FileRef", "PageVideoThumbnail", "PageType", "WebpartBanner"];

    // axios.get(this.props.apiURL)
    //   .then((result) => {
    //     console.log('This is your data', result.data.data[2].list)
    //     this.setState({ list: result.data.data[2].list });


    //   }

     // );
 // }


}
