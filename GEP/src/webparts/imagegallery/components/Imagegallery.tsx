import * as React from 'react';
import { IImagegalleryProps } from './IImagegalleryProps';
import { escape } from '@microsoft/sp-lodash-subset';
import axios from "axios";
import GDService from '../../../Services/GetDataService';
import { Web } from '@pnp/sp/presets/all';
import './../../../Frameworks/common/css/bootstrap.min.css';
import './ImageGallery.css';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import ReactLoading from "react-loading";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export interface IImageGalleryStates {
  list: IPageItem[];
  currentPageItems: IPageItem[];
  totalPages: number;
  items: IPageItem[];
  currentPage: number;
  isDataLoading: boolean;
  isLightBoxDisplay: boolean;
  buttonColor: string;
  listimage: string;
}
export interface IPageItem {
  service_title: string;
  image_url: string;
  description: string;
  title_alias: string;
  ServerRelativeUrl: string;
}
let listItems: any[] = [];
export default class Imagegallery extends React.Component<IImagegalleryProps, IImageGalleryStates, {}> {
  private ServiceInatance: GDService;
  public tempPageItems: IPageItem[] = [];
  public constructor(props: IImagegalleryProps, state: IImageGalleryStates) {
    super(props);
    this.state = {
      list: [],
      currentPageItems: [],
      totalPages: 5,
      items: [],
      currentPage: 5,
      isDataLoading: true,
      buttonColor: props.buttonColor,
      isLightBoxDisplay: false,
      listimage: '',
      //assettype: []
    };
  }
  public componentDidMount() {
    this.getLibrarydata();
    this.getPromotionaldata();
    // this.getGalleryDetails();
  }
  public async getLibrarydata() {
    let category = window.location.href;
    var myParam = location.search.split('category=')[1];
    var titlename = "ImageGallery/" + myParam;
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

  public async getPromotionaldata() {
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
  public render(): React.ReactElement<IImagegalleryProps> {
    document.documentElement.style.setProperty("--button-color", this.state.buttonColor);
    var titlealias = window.location.protocol;
    let str = this.props.webparttitle;
    str = str.replace(/\s+/g, '-').toLowerCase();
    let weburl = this.props.apiURL;
    // card-gallery-code
    const imageCards = this.state.list.map((data) => {
      console.log("listdata is", this.state.list);
      return data.ServerRelativeUrl;
    });
    const showImage = (image) => {
      this.setState({
        listimage: image,
        isLightBoxDisplay: true
      });
    };

    const hideLightBox = () => {
      this.setState({
        isLightBoxDisplay: false
      });
    };

    //show next image in lightbox
    const showNext = (e) => {
      e.stopPropagation();
      let currentIndex = imageCards.indexOf(this.state.listimage);
      console.log(imageCards.indexOf(this.state.listimage));
      if (currentIndex >= imageCards.length - 1) {
        this.setState({
          isLightBoxDisplay: false
        });
      } else {
        let nextImage = imageCards[currentIndex + 1];
        this.setState({
          listimage: nextImage,
        });
      }
    };

    //show previous image in lightbox
    const showPrev = (e) => {
      e.stopPropagation();
      let currentIndex = imageCards.indexOf(this.state.listimage);
      if (currentIndex <= 0) {
        this.setState({
          isLightBoxDisplay: false
        });
      } else {
        let nextImage = imageCards[currentIndex - 1];
        this.setState({
          listimage: nextImage,
        });
      }
    };
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
                    let imgSrc = detail.ServerRelativeUrl;
                    return (
                      //   <div key={index} className="col-12 col-lg-4 col-md-6 col-sm-6 col-xl-3">
                      <div key={index} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4" onClick={() => showImage(detail.ServerRelativeUrl)}>
                        <div className="card">
                          <img src={imgSrc} alt="imageCard" className="imageCard" />
                        </div>
                        <br></br>
                      </div>
                    );
                  })
                }
                {this.state.isLightBoxDisplay ?
                  <div id="lightbox" onClick={hideLightBox}>
                    <button onClick={showPrev}><FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon></button>
                    <img id="lightbox-img" src={this.state.listimage} />
                    <button onClick={showNext}><FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon></button>
                  </div>
                  : ""}
              </div>
            </div>
        }
      </section>
    );
  }
}
