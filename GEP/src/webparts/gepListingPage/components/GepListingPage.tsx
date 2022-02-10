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
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import ReactLoading from "react-loading";

export interface IGEPListingPageStates {
  list: IPageItem[];
  currentPageItems: IPageItem[];
  totalPages: number;
  items: IPageItem[];
  currentPage: number;
  isDataLoading: boolean;
  buttonColor: string;
  downloadurl: string;
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
let mediaType: string;
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
    };
  }

  public componentDidMount() {
    this.getSitePageDetails();
    this.getLibrarydata();
  }

  public async getSitePageDetails() {
    let category = window.location.href;
    var myParam = location.search.split('category=')[1];
    console.log("Blog Category is ******", myParam);
    this.ServiceInatance = new GDService(this.props.context);
    let web = Web(`${this.props.context.pageContext.web.absoluteUrl}/`);
    //  let maxItems = this.props.maxItem ? this.props.maxItem : 5;
    const orderByQuery = { columnName: "Modified", ascending: false };
    const internalColumnName = ["Title", "ExternalApi", "DownloadUrl"];
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
        // console.log("ListDetails:", listData[0].ExternalApi);
        var externalurl = listData[0].ExternalApi;
        var weburl = "listData[0].ExternalApi";
        var url = this.props.apiURL + externalurl;
        var downloadurl = listData[0].DownloadUrl;
        // console.log("url is:", listData[0].DownloadUrl);
        this.getDetails(url);
        listItems.push(url);
        this.setState({
          downloadurl: listData[0].DownloadUrl
        });
      }
    }).catch((error) => {
      console.log(error);
      this.setState({
        isDataLoading: false
      });
    });
  }
  public async getLibrarydata() {
    let category = window.location.href;
    var myParam = location.search.split('category=')[1];
    var titlename = "PromotionalLibrary/" + myParam;
    this.props.context.spHttpClient.get(this.props.context.pageContext.web.absoluteUrl +
      `/_api/Web/GetFolderByServerRelativeUrl('${titlename}')?$expand=Folders,Files`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          //'Content-type': 'application/json;odata=nometadata',
          'odata-version': ''
        }
      })
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          response.json().then((responseJSON) => {
            console.log("data is >>>>", responseJSON);
            var imgurl = responseJSON.Files;
            listItems.push(imgurl);
            this.setState({ list: imgurl, isDataLoading: false });
          });
        }
      });
  }

  private async getDetails(url: string) {
    // axios({
    //   method: 'GET',
    //   url: url,//urldownload
  
    //   headers: {
    //     'Accept': 'application/json;odata=nometadata',
    //     'Content-type': 'application/json;odata=nometadata',
    //     'Access-Control-Allow-Origin': '*'
    //   },
    // })
     axios.get(url)
      .then((result) => {
        console.log('This is api list data', result.data.data[2].list);
        this.setState({
          list: result.data.data[2].list,
          isDataLoading: false
        });
      }
      );
  }

  public async getdetailsUrl(titlealias: string) {
    debugger;
    var urldownload = this.state.downloadurl;
    var title = titlealias;
    const payload = {
      usragent: 'ipad_retina',
      title_alias: 'webcasts/the-advent-of-strategic-procurement-ushering-a-new-era-of-digital-led-transformation',
      //'titlealias',
      //  var fileExtension = fileName.split('.').pop(); 
      usrcode: 85
    };
    axios({
      method: 'POST',
      url: 'https://webdev.gep.com/WebinarDetail',//urldownload
      data: payload, // you are sending body instead
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'Content-type': 'application/json;odata=nometadata',
        // 'Access-Control-Allow-Origin': '*'
      },
    })
      .then((response) => {
        console.log("new details >>>>>>>>>>>>>", response.data);
        this.setState({
          items: response.data
        });
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  public play(mediaitemlink: string, Mediatype: string)//get parameter from iconimage
  {
    document.getElementById('video-popup').style.display = 'block';
    mediaType = Mediatype;
    if (Mediatype == "Audio") {
      
      document.querySelector('.video-popup .video-popup__inner .video-con').innerHTML = '<audio src=' + mediaitemlink + ' controls autoPlay preload="none" />';
    
    }
    else {
      document.querySelector('.video-popup .video-popup__inner .video-con').innerHTML = '<video src=' + mediaitemlink + ' controls autoPlay  />';
    }
  }


  public render(): React.ReactElement<IGepListingPageProps> {
    document.documentElement.style.setProperty("--button-color", this.state.buttonColor);
    var titlealias = window.location.protocol;
    let str = this.props.webparttitle;
    str = str.replace(/\s+/g, '-').toLowerCase();
    let weburl = this.props.apiURL;
    return (
      <section className="section__content bg-white">
        {
          this.state.isDataLoading ?
            <ReactLoading className="mainLoader"
              type="spin" color={this.state.buttonColor} width={'70px'} height={'70px'} />
            :
            <div className="container-fluid">
              <div className="row">
                {
                  this.state.list.map((detail, index) => {
                    let imgSrc = detail.image_url || detail.ServerRelativeUrl;
                  //  let description = detail.description.replace(/(?:\r\n|\r|\n|\t|&gt;|&lt|;p|&amp|;rsquo;s|&lt;p&gt;|;mdash;|;rsquo;t|)/g, '').toLowerCase();
                    return (
                      <div key={index} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
                         <div className="card" onClick={() => this.getdetailsUrl(detail.title_alias)}>                       
                          <img src={imgSrc} alt="imageCard" className="imageCard" />         
                          <div className="imageContent row-no-padding">
                            <div className="row align-items-end">
                              <div className="col-9 col-md-9">
                              </div>
                              <div className="col-3 col-md-12">
                              <a href="#" target="_blank" style={{ textDecoration: 'none' }} className="d-block">View More</a>
                                {/* <a href={weburl + detail.title_alias} target="_blank" style={{ textDecoration: 'none' }} className="d-block">View More</a> */}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="TilesTitle">{detail.service_title}</p>
                        {/* <p className="Tilesdescription">{description.substring(0, 1).toUpperCase() + description.substring(1, this.props.descriptionlength) + '...'}</p> */}
                        <br></br>
                      </div>
                    );
                  })
                }
              </div>
            </div>}
      </section>
    );
  }
}
