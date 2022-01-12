import * as React from 'react';

import { IImagegalleryProps } from './IImagegalleryProps';
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
import ReactLoading from "react-loading";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import WhitePaperDetails from '../../whitePaperDetails/components/WhitePaperDetails';

export interface IImageGalleryStates {
  list: IPageItem[];
  currentPageItems: IPageItem[];
  totalPages: number;
  items: IPageItem[];
  currentPage: number;
  isDataLoading: boolean;
  buttonColor: string;
}
export interface IPageItem {
  service_title: string;
  image_url: string;
  description: string;
  title_alias: string;
}
let listItems: any[] = [];
export default class Imagegallery extends React.Component<IImagegalleryProps,IImageGalleryStates, {}> {
  public _ops: GDService;
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
      //assettype: []
    };
  }
  public componentDidMount() {
    this.getLibrarydata();
  // this.getGalleryDetails();
  }
  public async getLibrarydata() {
    
    let category=window.location.href;
    var myParam = location.search.split('category=')[1];
    var titlename="ImageGallery/"+`'${myParam}'`;
    this.props.context.spHttpClient.get(this.props.context.pageContext.web.absoluteUrl + 
      
      `/_api/Web/GetFolderByServerRelativeUrl('titlename')?$expand=Folders,Files`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          //'Content-type': 'application/json;odata=nometadata',
          'odata-version': ''
        }
      })
      .then((response: SPHttpClientResponse) => {
        debugger;
        if (response.ok) {
          response.json().then((responseJSON) => {
            console.log("data is >>>>", responseJSON.Files);
            let imgurl=responseJSON.Files;
            this.getLibraryDetails(imgurl);
          });
        }
      });
  }
  private async getLibraryDetails(imgurl: string) {
    axios.get(imgurl)
      .then((result) => {
        console.log('This is api list data', result.data);
        this.setState({ list: result.data,
          isDataLoading:false });
      
      }

      );
      }
  public render(): React.ReactElement<IImagegalleryProps> {
    document.documentElement.style.setProperty("--button-color", this.state.buttonColor);
    var titlealias = window.location.protocol;
    let str = this.props.webparttitle;
    str = str.replace(/\s+/g, '-').toLowerCase();
   
    let weburl=this.props.apiURL;
    
    return (
      <section className="section__content bg-white">
         {
          this.state.isDataLoading ?
            <ReactLoading className="mainLoader"
              type="spin" color={this.state.buttonColor} width={'70px'} height={'70px'} />

            :
        <div className="container">
          <div className="row">

          {
              this.state.list.map((detail, index) => {
                let imgSrc = detail.image_url;
                return (
               //   <div key={index} className="col-12 col-lg-4 col-md-6 col-sm-6 col-xl-3">
               <div key={index} className="col-12 col-sm-8 col-md-6 col-lg-4 col-xl-4">
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

                            <a href={weburl+detail.title_alias} target="_blank" style={{ textDecoration: 'none' }} className="d-block">View More</a>
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
  }
      </section>
    );
  }


 
}
