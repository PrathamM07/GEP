import * as React from 'react';
//import styles from './GepListingPage.module.scss';
import { IGepListingPageProps } from './IGepListingPageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import axios from "axios";
import GDService from '../../../Services/GetDataService';
import { Web } from '@pnp/sp/presets/all';
import './../../../Frameworks/common/css/bootstrap.min.css';
import './DetailPage.css';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IAllItems } from '../../../Services/IListOperation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faSave } from '@fortawesome/free-solid-svg-icons';
import fileDownload from 'js-file-download';
import ReactLoading from "react-loading";
import download from "downloadjs";
import { saveAs } from "file-saver";
export interface IGEPListingPageStates {
  list: IPageItem[];
  currentPageItems: IPageItem[];
  totalPages: number;
  items: IPageItem[];
  currentPage: number;
  isDataLoading: boolean;
  buttonColor: string;
  downloadurl: string;
  Iconimage: string;
  CardTitle: string;
  url: string;
  count: number;
  total_pages: number;
  visible:number;
}
export interface IPageItem {
  service_title: string;
  image_url: string;
  description: string;
  title_alias: string;
  ServerRelativeUrl: string;
  download_url: string;
  MediaItemLink: string;
  MediaType: string;

}

let listItems: any[] = [];
let FileType: string;
export default class GepListingPage extends React.Component<IGepListingPageProps, IGEPListingPageStates, {}> {
  private ServiceInatance: GDService;
  public tempPageItems: IPageItem[] = [];
  public constructor(props: IGepListingPageProps, state: IGEPListingPageStates) {
    super(props);
    this.state = {
      list: [],
      currentPageItems: [],
      totalPages: 5,
      items: [],
      currentPage: 5,
      isDataLoading: true,
      buttonColor: props.buttonColor,
      downloadurl: '',
      Iconimage: '',
      CardTitle: '',
      url: '',
      count: 1,
      total_pages: 0,
      visible:25,
    };
    this.PaginationDetails = this.PaginationDetails.bind(this);
  }

  public componentDidMount() {
    this.getSitePageDetails();
  }
 
  public async getSitePageDetails() {//main funtion to load list data
    debugger;
    let category = window.location.href;
    var myParam = location.search.split('category=')[1];
    console.log("Blog Category is ******", myParam);
    this.ServiceInatance = new GDService(this.props.context);
    let web = Web(`${this.props.context.pageContext.web.absoluteUrl}/`);
    //  let maxItems = this.props.maxItem ? this.props.maxItem : 5;
    const orderByQuery = { columnName: "Modified", ascending: false };
    const internalColumnName = ["Title", "ExternalApi", "DownloadUrl", "IconImage"];
    //const expandColumnName = ["AssetType"];
    let filterQuery = `Title eq '${myParam}'`;
    const ListDetails: IAllItems = {
      listName: "Informational Content",
      selectQuery: internalColumnName.join(','),
      // expandQuery: expandColumnName.join(','),
      filterQuery: filterQuery,
      // topQuery: parseInt(maxItems.toString()),
      // orderByQuery: orderByQuery
    };
    await this.ServiceInatance.getAllListItems(ListDetails).then((listData: any[]) => {
      if (listData && listData.length > 0) {
        console.log("ListDetails:", listData[0].ExternalApi);
        var externalurl = listData[0].ExternalApi;
        var weburl = "listData[0].ExternalApi";
        var url = this.props.apiURL + externalurl;
        var downloadurl = listData[0].DownloadUrl;
        // console.log("url is:", listData[0].DownloadUrl);
        // this.getDetails(url);
        this.getDetails(url.toString());
        listItems.push(url);
        this.setState({
          downloadurl: listData[0].DownloadUrl,
          Iconimage: listData[0].IconImage,
          CardTitle: myParam
        });
      }
    }).catch((error) => {
      console.log(error);
      this.setState({
        isDataLoading: false
      });
    });
  }
  private async getDetails(url: string) {
    axios.get(url)
      .then((result) => {
        console.log("api result", result);
        console.log("list page result", result.data.total_pages);
        this.setState({
          list: result.data.data[2].list,
          isDataLoading: false,
          total_pages: result.data.total_pages,
        });
      }
      );
  }
 
  public async PaginationDetails() {// to load load more data
    let category = window.location.href;
    var myParam = location.search.split('category=')[1];
    console.log("Blog Category is ******", myParam);
    this.ServiceInatance = new GDService(this.props.context);
    let web = Web(`${this.props.context.pageContext.web.absoluteUrl}/`);
    const orderByQuery = { columnName: "Modified", ascending: false };
    const internalColumnName = ["Title", "ExternalApi", "DownloadUrl", "IconImage"];
    let filterQuery = `Title eq '${myParam}'`;
    const ListDetails: IAllItems = {
      listName: "Informational Content",
      selectQuery: internalColumnName.join(','),
      filterQuery: filterQuery,
    };
    await this.ServiceInatance.getAllListItems(ListDetails).then((listData: any[]) => {
      if (listData && listData.length > 0) {
        console.log("ListDetails:", listData[0].ExternalApi);
        var externalurl = listData[0].ExternalApi;
        var url = this.props.apiURL + externalurl;
        this.getpaginationDetails(url.toString());
        listItems.push(url);
        const count = this.state.count;
        this.setState({
          isDataLoading: false,
          downloadurl: listData[0].DownloadUrl,
          Iconimage: listData[0].IconImage,
          CardTitle: myParam,
          count: count + 1
        });
      }
    }).catch((error) => {
      console.log(error);
      this.setState({
        isDataLoading: false
      });
    });
  }
  private async getpaginationDetails(url: string) {
    axios.get(url, {
      params: {
        page: this.state.count
      }
    })
      .then((result) => {
        console.log("api result", result);
        this.setState({
          list: [...this.state.list, ...result.data.data[2].list],
          isDataLoading: false
        });
      }
      );
  }

  public async getdetailsUrl(titlealias: string) {
    let category = window.location.href;
    var myParam = location.search.split('category=')[1];
    var urldownload = this.state.downloadurl;
    var api = this.props.apiURL;
    var title = titlealias;
    var blogurl = api + title;
    let formData = new FormData();    //formdata object
    formData.append('usragent', 'ipad_retina');   //append the values with key, value pair
    formData.append('title_alias', title);
    formData.append('usrcode', '85');
    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    };
    axios.post(urldownload, formData, config)
      .then(response => {
        console.log("Post data is *******************", response.data.data[0]);
        var download_url = response.data.data[0].download_url;
        console.log("Output data is", download_url);
        var ext = download_url.split('.').pop();
        debugger;
        if (ext === 'pdf') {
          this.Downloadpdffile(download_url);
        }
        else if (ext === 'mp3' || ext === 'mp4') {
          this.play(download_url);
        }
        else if (myParam === 'BLOGS') {
          window.open(blogurl);
        }
        else {
          alert('Not any data found');
        }
        this.setState({
          url: download_url
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  public play(url: string)//get parameter from iconimage
  {
    document.getElementById('video-popup').style.display = 'block';
    var ext = url.split('.').pop();
    FileType = ext;
    if (FileType == "mp3") {
      document.querySelector('.video-popup .video-popup__inner .video-con').innerHTML = '<audio src=' + url + ' controls autoPlay preload="none" />';
    }
    else {
      document.querySelector('.video-popup .video-popup__inner .video-con').innerHTML = '<video src=' + url + ' controls autoPlay  />';
    }
  }
  public Downloadpdffile(url: string) {
    axios({
      url: url, //your url
      method: 'GET',
      responseType: 'blob',
  }).then((response) => {
    var link=url;
    console.log("data is my",link);
     var pdffile =link.lastIndexOf('/');
     var result = link.substring(pdffile + 1);
     console.log("data is that",result);
      saveAs(
      response.data,
     result
    );
  });
  }

  public render(): React.ReactElement<IGepListingPageProps> {
    document.documentElement.style.setProperty("--button-color", this.state.buttonColor);
    var titlealias = window.location.protocol;
    let str = this.props.webparttitle;
    str = str.replace(/\s+/g, '-').toLowerCase();
    let weburl = this.props.apiURL;
    let category = window.location.href;
    var myParam = location.search.split('category=')[1];
    var CardTitle = this.state.CardTitle.replace('-', ' ').toUpperCase();
    var pagelink = this.props.context.pageContext.web.absoluteUrl;
    var ext = this.state.url.split('.').pop();
    const closeButton = () => {
      document.getElementById('video-popup').style.display = 'none';
      (FileType === 'mp4') ?
        document.querySelector('.video-popup .video-popup__inner .video-con').innerHTML = '<video src=' + this.state.url + ' controls pause preload="none" />'
        :
        document.querySelector('.video-popup .video-popup__inner .video-con').innerHTML = '<audio src=' + this.state.url + ' controls pause preload="none"/>';
    };

    return (
      <section className="section__content bg-white">
        {
          this.state.isDataLoading ?
            <ReactLoading className="mainLoader"
              type="spin" color={this.state.buttonColor} width={'70px'} height={'70px'} />
            :
            <div className="container">
              <div className="row">
                <div className='col-md-4'>
                  <a onClick={() => { window.location.href = pagelink }} style={{ textDecoration: 'none' }} className="d-block"><p className="CardTitle">{CardTitle}</p></a>
                </div>
                <div className='col-md-8'></div>
                {this.state.list.length > 0 &&
                  this.state.list.map((detail, index) => {
                    let imgSrc = detail.image_url || detail.ServerRelativeUrl;
                    let iconimage = this.state.Iconimage;
                    //  let description = detail.description.replace(/(?:\r\n|\r|\n|\t|&gt;|&lt|;p|&amp|;rsquo;s|&lt;p&gt;|;mdash;|;rsquo;t|)/g, '').toLowerCase();
                    return (
                      <div key={index} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
                        <div className="Detailcard" onClick={(event) => { if (myParam != "PODCAST" && myParam != "WEBINARS") this.getdetailsUrl(detail.title_alias) }}>
                          <img src={imgSrc} alt="imageCard" className="imageCard" />
                          {
                            (myParam === "PODCAST" || myParam === "WEBINARS") ?
                              <img className="play" src={JSON.parse(iconimage).serverRelativeUrl} alt="playButton" onClick={(event) => this.getdetailsUrl(detail.title_alias)} />
                              :
                              ''}
                          <div className="clickbtn">
                            <p className="TilesTitle">{detail.service_title}</p>
                            {
                              (myParam === "PODCAST" || myParam === 'WEBINARS') ?
                                (myParam === "PODCAST") ?
                                  <button className="Readmorebtn">Listen Now&nbsp;&nbsp;<FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon><FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon></button>
                                  :
                                  <button className="Readmorebtn">Watch Now&nbsp;&nbsp;<FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon><FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon></button>
                                :
                                <button className="Readmorebtn">Read More&nbsp;&nbsp;<FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon><FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon></button>
                            }
                          </div>
                        </div>
                        <div className="video-popup" id="video-popup">
                          <div className="video-popup__inner" id="video-popup__inner">
                            <span className="close__button" id="close__button" onClick={closeButton}>&times;</span>
                            <div className="video-con" id="video-con">
                            </div>
                          </div>
                        </div>
                        {/* <p className="Tilesdescription">{description.substring(0, 1).toUpperCase() + description.substring(1, this.props.descriptionlength) + '...'}</p> */}
                        <br></br>
                      </div>
                    );
                  })
                }
              </div>
              {
                (this.state.total_pages === this.state.count) ?
                  ''
                  :
                  <div className="loadbtn">
                    {this.state.list && <button className="loadmorebtn" onClick={this.PaginationDetails}>Load More...</button>                   
                  }
                  </div>
              }
            </div>
        }
      </section>
    );
  }
}


