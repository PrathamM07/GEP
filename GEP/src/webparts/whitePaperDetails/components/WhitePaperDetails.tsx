import * as React from 'react';
import { IWhitePaperDetailsProps } from './IWhitePaperDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import axios from "axios";
import GDService from '../../../Services/GetDataService';
import { Web } from '@pnp/sp/presets/all';
import './../../../Frameworks/common/css/bootstrap.min.css';
//import './Body.css';
import '../../../asset/Body.css';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IAllItems } from '../../../Services/IListOperation';
import { DetailsList, List } from 'office-ui-fabric-react';
import ReactLoading from "react-loading";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import styles from './WhitePaperDetails.module.scss';
export interface IWhitePaperDetailsStates {
  list: IPageItem[];
  currentPageItems: IPageItem[];
  totalPages: number;
  items: IPageItem[];
  currentPage: number;
  dynamicUrl: string;
  defaultIcon: string;
  isDataLoading: boolean;
  buttonColor: string;
}
export interface IPageItem {
  service_title: string;
  image_url: string;
  description: string;
  title_alias: string;
  Title: string;
  ImageThumbnail: string;
  ExternalApi: string;
  PageDetailUrl: string;
  IconImage: string;
}

let listItems: any;
let logoimage: string;
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
      dynamicUrl: "",
      defaultIcon: "",
      isDataLoading: true,
      buttonColor: props.buttonColor,
      //assettype: []
    };
    this.getHomePageDetails = this.getHomePageDetails.bind(this);
    this.getIconDetails = this.getIconDetails.bind(this);

  }

  public async componentDidMount() {
    this.getHomePageDetails();
    this.getIconDetails();

  }

  public async componentWillReceiveProps(nextProps) {

    this.getHomePageDetails();
    this.getIconDetails();
    this.setState({
      buttonColor: nextProps.buttonColor
    });
  }
  public async getHomePageDetails() {
    this.ServiceInatance = new GDService(this.props.context);
    const internalColumnName = ["Title", "ImageThumbnail", "ExternalApi", "IconImage"];
    // let maxItems = this.props.maxItems;
    let web = Web(`${this.props.context.pageContext.web.absoluteUrl}/`);
    const SitePagesList: IAllItems = {
      listName: this.props.contenttype,
      selectQuery: internalColumnName.join(','),
      // expandQuery: expandColumnName.join(','),
      // topQuery: parseInt(maxItems),
      // filterQuery: filterQuery
    };
    await this.ServiceInatance.getAllListItems(SitePagesList).then((pageData) => {

      if (pageData && pageData.length > 0) {
        console.log("Content data type is >>>>>>>>>>>>>", pageData);
        this.setState({ list: pageData, isDataLoading: false });
        var listdata = pageData;
        this.getData(listdata.toString());
        //this.mapPageData(pageData, web);
      }
    }).catch((error) => {
      console.log(error);
      this.setState({
        isDataLoading: false
      });

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

  public async getIconDetails() {
    this.ServiceInatance = new GDService(this.props.context);
    let web = Web(`${this.props.context.pageContext.web.absoluteUrl}/`);
    //  let maxItems = this.props.maxItem ? this.props.maxItem : 5;
    const orderByQuery = { columnName: "Modified", ascending: false };
    const internalColumnName = ["Title", "ImageThumbnail"];
    //const expandColumnName = ["AssetType"];
    let filterQuery = `Title eq '${this.props.contenttype}'`;

    const ListDetails: IAllItems = {
      listName: "Contents",
      selectQuery: internalColumnName.join(','),
      // expandQuery: expandColumnName.join(','),
      filterQuery: filterQuery,
      // topQuery: parseInt(maxItems.toString()),
      // orderByQuery: orderByQuery
    };

    await this.ServiceInatance.getAllListItems(ListDetails).then((IconData: any[]) => {
      if (IconData && IconData.length > 0) {
        this.mapIconData(IconData);
      }

    }).catch((error) => {
      console.log(error);
      this.setState({
        isDataLoading: false
      });
    });
  }

  public async mapIconData(libraryData: any) {
    let tempPageItem = {
      defaultImageUrl: "",
    };
    try {
      tempPageItem.defaultImageUrl = JSON.parse(libraryData[0].ImageThumbnail).serverRelativeUrl;
      // console.log("DefaultImageurl: ", tempPageItem.defaultImageUrl);

      this.setState({
        defaultIcon: tempPageItem.defaultImageUrl,

      });
    } catch (error) {
      console.log(error);
      this.setState({
        isDataLoading: false
      });
    }
  }
  // public async getLibrarydata() {


  //   this.props.context.spHttpClient.get(this.props.context.pageContext.web.absoluteUrl + 

  //     `/_api/Web/GetFolderByServerRelativeUrl('ImageGallery/OFFICES')?$expand=Folders,Files`,


  //     SPHttpClient.configurations.v1,
  //     {
  //       headers: {
  //         'Accept': 'application/json;odata=nometadata',
  //         //'Content-type': 'application/json;odata=nometadata',
  //         'odata-version': ''
  //       }
  //     })
  //     .then((response: SPHttpClientResponse) => {
  //       debugger;
  //       if (response.ok) {
  //         response.json().then((responseJSON) => {
  //           console.log("data is >>>>", responseJSON.Files);
  //         });
  //       }
  //     });
  // }
  public render(): React.ReactElement<IWhitePaperDetailsProps> {
    document.documentElement.style.setProperty("--button-color", this.state.buttonColor);
    var titlealias = window.location.protocol;

    let str = this.props.webparttitle;

    const video = this.props.video;
    const audio = this.props.audio;
    //console.log("Video file", this.props.video)
    const play = () => {
     // console.log(video);
     document.getElementById('video-popup').style.display = 'block';
    document.querySelector('.video-popup .video-popup__inner .video-con').innerHTML=(this.props.audio==''||this.props.video=='')?'<video src='+video+' controls autoPlay  />':'<audio src='+audio+' controls autoPlay preload="none"/>';       
  //  (this.props.audio===''||this.props.video==='')?'<audio src='+audio+' controls autoPlay preload="none"/>':'<video src='+video+' controls autoPlay  />';       
  
    }
    const closeButton = () => {
      document.getElementById('video-popup').style.display = 'none';
      document.querySelector('.video-popup .video-popup__inner .video-con').innerHTML=
      //(this.props.audio===''||this.props.video==='')?'<audio src='+audio+' controls pause/>':'<video src='+video+' controls pause  />';       

      (this.props.audio===''||this.props.video==='')?'<video src='+video+' controls pause  />':'<audio src='+audio+' controls pause/>';       
   
    }

    // console.log("new list icon", this.state.list);
    return (
     
      <section className="section__content bg-white">
        {
          this.state.isDataLoading ?
            <ReactLoading className="mainpageLoader"
              type="spin" color={this.state.buttonColor} width={'70px'} height={'70px'} />

            :
            <div className="container">
              <div className="row">
              
                <div className="col-md-12">
                  {

                    (this.props.contenttype == "") ?

                      // <div className="heading">PROMOTIONAL CONTENT</div>
                      <div className="heading"><img src={this.state.defaultIcon} alt="icon" className="icon" />{this.props.contenttype}</div>
                      :
                      <div className="heading"><img src={this.state.defaultIcon} alt="icon" className="icon" />{this.props.contenttype}</div>

                  }
                </div>

                {


                  this.state.list.slice(0, this.props.maxItem).map((detail, index) => {
                    let imgSrc = detail.ImageThumbnail;

                    var title = (detail.Title).replace(/\s+/g, '-');
                    var subtitle = (detail.Title).replace('-', " ");
                    return (

                      <div key={index} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3">
                        <div className="card">

                          <img src={JSON.parse(imgSrc).serverRelativeUrl} alt="imageCard" className="imageCard" />
                          {
                            (detail.IconImage === null) ?
                              ''
                              :
                              <img className="play" src={JSON.parse(detail.IconImage).serverRelativeUrl} alt="playButton" onClick={play} />
                          }
                          {/* {(props.play === '') ? '' : <img className="play" src={props.play} alt="playButton" onClick={play} />}
                  */}
                          <div className="imageContent row-no-padding">
                            <div className="row align-items-end">
                              <div className="col-9 col-md-9">
                                <h3 className="mb-0">{subtitle}</h3>
                              </div>


                              <div className="col-3 col-md-3 text-right">
                                {/* {(this.props.contenttype == "Promotional Content" || this.props.contenttype == "Informational Content") ? */}
                                {(this.props.contenttype != "") ?

                                  <a href="javascript:void(0);" target="_blank" style={{ textDecoration: 'none' }} className="d-block" onClick={(e) => { e.preventDefault(); window.open(`https://prathameshneo.sharepoint.com/sites/GEP/SitePages/GepListing-Page.aspx?category=${title}`); return false; }}>View all</a>
                                  :
                                  <a href="#" ></a>
                                }
                              </div>


                            </div>
                          </div>



                          <div className="video-popup" id="video-popup">
                            <div className="video-popup__inner" id="video-popup__inner">
                              <span className="close__button" id="close__button" onClick={closeButton}>&times;</span>
                              <div className="video-con" id="video-con">
                              </div>
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
        }
      </section>
    );
  }
}
