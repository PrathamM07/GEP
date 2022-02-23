import * as React from 'react';
import { IWhitePaperDetailsProps } from './IWhitePaperDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import axios from "axios";
import GDService from '../../../Services/GetDataService';
import { Web } from '@pnp/sp/presets/all';
import './../../../Frameworks/common/css/bootstrap.min.css';
import '../../../asset/Body.css';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IAllItems } from '../../../Services/IListOperation';
import { DetailsList, List } from 'office-ui-fabric-react';
import ReactLoading from "react-loading";
//import styles from './WhitePaperDetails.module.scss';
export interface IWhitePaperDetailsStates {
  list: IPageItem[];
  currentPageItems: IPageItem[];
  totalPages: number;
  items: IPageItem[];
  currentPage: number;
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
  Videos: string;
  MediaItemLink: string;
  MediaType: string;
  ID:string;

}
let mediaType: string;
export default class WhitePaperDetails extends React.Component<IWhitePaperDetailsProps, IWhitePaperDetailsStates> {
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
      defaultIcon: "",
      isDataLoading: true,
      buttonColor: props.buttonColor,
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
    const internalColumnName = ["Title", "ImageThumbnail", "ExternalApi", "IconImage", "MediaItemLink", "MediaType","ID"];
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
      }
      );
  }
  public async getIconDetails() {
    this.ServiceInatance = new GDService(this.props.context);
    let web = Web(`${this.props.context.pageContext.web.absoluteUrl}/`);
    const orderByQuery = { columnName: "Modified", ascending: false };
    const internalColumnName = ["Title", "ImageThumbnail"];
    let filterQuery = `Title eq '${this.props.contenttype}'`;
    const ListDetails: IAllItems = {
      listName: "Contents",
      selectQuery: internalColumnName.join(','),
      filterQuery: filterQuery,
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

  public play(mediaitemlink: string, Mediatype: string)//get parameter from iconimage
  {
    document.getElementById('video-popup').style.display = 'block';
    mediaType = Mediatype;
    (Mediatype === 'Audio') ?
      document.querySelector('.video-popup .video-popup__inner .video-con').innerHTML = '<audio src=' + mediaitemlink + ' controls autoPlay preload="none" />'
      :
      document.querySelector('.video-popup .video-popup__inner .video-con').innerHTML = '<video src=' + mediaitemlink + ' controls autoPlay  />';

  }
  public ImageData(title: string)//get imageclick tiles title
  {
    (title != "PODCAST" && title != 'WEBINARS') ?
    window.open((this.props.context.pageContext.web.absoluteUrl + `/SitePages/GepListing-Page.aspx?category=${title}`))
    :
    window.open((this.props.context.pageContext.web.absoluteUrl + `/SitePages/GepListing-Page.aspx?category=${title}`))
  }
  public ImageClickData(title: string ,id:string)//get imageclick tiles title
  {
    debugger;
    (this.props.contenttype != 'Image Library') ?
      (title != "DIGITAL-BANNERS" && title != 'ADVERTORIALS') ?
        (title == 'RADIO-SPOTS') ?
          window.open((this.props.context.pageContext.web.absoluteUrl + `/SitePages/RadioSpots.aspx?category=${title}`))
          :
          window.open((this.props.context.pageContext.web.absoluteUrl + `/SitePages/TelevisionSpots.aspx?category=${title}`))
        :
        window.open((this.props.context.pageContext.web.absoluteUrl + `/SitePages/Groups.aspx?category=${id}`))
      :
      window.open((this.props.context.pageContext.web.absoluteUrl + `/SitePages/ImageGallery.aspx?category=${title}`))
  }

  public render(): React.ReactElement<IWhitePaperDetailsProps> {
    document.documentElement.style.setProperty("--button-color", this.state.buttonColor);
    var titlealias = window.location.protocol;
    let str = this.props.webparttitle;

    const closeButton = () => {
      document.getElementById('video-popup').style.display = 'none';
      (mediaType === 'Video') ?
        document.querySelector('.video-popup .video-popup__inner .video-con').innerHTML = '<video src=' + mediaType + ' controls pause preload="none" />'
        :
        document.querySelector('.video-popup .video-popup__inner .video-con').innerHTML = '<audio src=' + mediaType + ' controls pause preload="none"/>';
    };

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
                      <div className="heading"><img src={this.state.defaultIcon} alt="icon" className="icon" />{this.props.contenttype}</div>
                      :
                      <div className="heading"><img src={this.state.defaultIcon} alt="icon" className="icon" />{this.props.contenttype}</div>
                  }
                </div>
                {
                  this.state.list.map((detail, index) => {
                    let imgSrc = detail.ImageThumbnail;
                    var title = (detail.Title).replace(/\s+/g, '-');
                    let id=(detail.ID);
                    var subtitle = (detail.Title).replace('-', " ");
                    return (
                      <div key={index} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3" >
                        {
                          (this.props.contenttype === 'Image Library' || this.props.contenttype === 'Promotional Content') ?

                            <div className="card" onClick={(e) => {if(!detail.MediaType)this.ImageClickData(title,detail.ID)}} >
                              <img src={JSON.parse(imgSrc).serverRelativeUrl} alt="imageCard2" className="imageCard" />
                              {
                                (detail.IconImage === null) ?
                                  ''
                                  :
                                  (detail.MediaType == 'Audio') ?
                                    <img className="play" src={JSON.parse(detail.IconImage).serverRelativeUrl} alt="playButton" onClick={(event) => this.play(detail.MediaItemLink, detail.MediaType)} />
                                    :
                                    <img className="play" src={JSON.parse(detail.IconImage).serverRelativeUrl} alt="playButton" onClick={(event) => this.play(detail.MediaItemLink, detail.MediaType)} />
                              }
                              <div className="imageContent row-no-padding">
                                <div className="row align-items-end">
                                  <div className="col-9 col-md-9">
                                    <h3 className="mb-0">{subtitle}</h3>
                                  </div>
                                  <div className="col-3 col-md-3 text-right">
                                    {
                                      (this.props.contenttype != "Image Library") ?
                                        (detail.Title != "DIGITAL BANNERS" && detail.Title != 'ADVERTORIALS') ?
                                          (detail.Title == 'RADIO SPOTS') ?
                                            <a href="javascript:void(0);" target="_blank" style={{ textDecoration: 'none' }} className="d-block" onClick={(e) => { e.preventDefault(); window.open(this.props.context.pageContext.web.absoluteUrl + `/SitePages/RadioSpots.aspx?category=${title}`); return false; }}>View all</a>
                                            :
                                            <a href="javascript:void(0);" target="_blank" style={{ textDecoration: 'none' }} className="d-block" onClick={(e) => { e.preventDefault(); window.open(this.props.context.pageContext.web.absoluteUrl + `/SitePages/TelevisionSpots.aspx?category=${title}`); return false; }}>View all</a>
                                          :
                                          <a href="javascript:void(0);" target="_blank" style={{ textDecoration: 'none' }} className="d-block" onClick={(e) => { e.preventDefault(); window.open(this.props.context.pageContext.web.absoluteUrl + `/SitePages/Groups.aspx?category=${id}`); return false; }}>View all</a>
                                        :
                                        <a href='#'></a>
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                            :
                            // <div className="card" onClick={() => window.open((this.props.context.pageContext.web.absoluteUrl + `/SitePages/GepListing-Page.aspx?category=${title}`), "_blank")} >
                            <div className="card" onClick={(e) => {if(!detail.MediaType)this.ImageData(title)}} > 
                            <img src={JSON.parse(imgSrc).serverRelativeUrl} alt="imageCard2" className="imageCard" />
                              {
                                (detail.IconImage === null) ?
                                  ''
                                  :
                                  (detail.MediaType == 'Audio') ?
                                    <img className="play" src={JSON.parse(detail.IconImage).serverRelativeUrl} alt="playButton" onClick={(event) => this.play(detail.MediaItemLink, detail.MediaType)} />
                                    :
                                    <img className="play" src={JSON.parse(detail.IconImage).serverRelativeUrl} alt="playButton" onClick={(event) => this.play(detail.MediaItemLink, detail.MediaType)} />
                              }
                              <div className="imageContent row-no-padding">
                                <div className="row align-items-end">
                                  <div className="col-9 col-md-9">
                                    <h3 className="mb-0">{subtitle}</h3>
                                  </div>
                                  <div className="col-3 col-md-3 text-right">
                                    <a href="javascript:void(0);" target="_blank" style={{ textDecoration: 'none' }} className="d-block" onClick={(e) => { e.preventDefault(); window.open(this.props.context.pageContext.web.absoluteUrl + `/SitePages/GepListing-Page.aspx?category=${title}`); return false; }}>View all</a>
                                  </div>
                                </div>
                              </div>                          
                            </div>
                        }
                        {
                          (detail.IconImage === null) ?
                            ''
                            :
                            <div className="video-popup" id="video-popup">
                              <div className="video-popup__inner" id="video-popup__inner">
                                <span className="close__button" id="close__button" onClick={closeButton}>&times;</span>
                                <div className="video-con" id="video-con">
                                </div>
                              </div>
                            </div>
                        }
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
