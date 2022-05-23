import * as React from 'react';
import { IPromotionalFoldersProps } from './IPromotionalFoldersProps';
import { escape } from '@microsoft/sp-lodash-subset';
import axios from "axios";
import GDService from '../../../Services/GetDataService';
import { Web } from '@pnp/sp/presets/all';
import './../../../Frameworks/common/css/bootstrap.min.css';
import './PromotionalFolder.css';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { sp } from "@pnp/sp/presets/all";
import { IAllItems } from '../../../Services/IListOperation';
import ReactLoading from "react-loading";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IPromotionalFolderStates {
  list: IPageItem[];
  currentPageItems: IPageItem[];
  totalPages: number;
  items: IPageItem[];
  currentPage: number;
  isDataLoading: boolean;
  isLightBoxDisplay: boolean;
  buttonColor: string;
  CardTitle:string;
}
export interface IPageItem {
  ImageThumbnail: string;
  Title:string;
}
export default class PromotionalFolders extends React.Component<IPromotionalFoldersProps,IPromotionalFolderStates, {}> {
  private ServiceInatance: GDService;
  public tempPageItems: IPageItem[] = [];
  public constructor(props: IPromotionalFoldersProps, state: IPromotionalFolderStates) {
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
      CardTitle:''
   
    };
  }
  public componentDidMount() {
   this.getFolderDetails();
  }

  public async getFolderDetails() {
    debugger;
    let category = window.location.href;
    let title = window.location.href;
    var myParam = location.search.split('title=')[0];
    var myParamid =  myParam.split('category=')[1];
     var myParamtitle = location.search.split('title=')[1];
    console.log("Folder Category is ******", myParamid);
    this.ServiceInatance = new GDService(this.props.context);
    const internalColumnName = ["Title", "ImageThumbnail","Category/ID" ];
    const expandColumnName = ["Category"];
    let filterQuery = `Category/ID eq '${myParamid}'`;
    let web = Web(`${this.props.context.pageContext.web.absoluteUrl}/`);
    const SitePagesList: IAllItems = {
      listName: 'Promotional Folder Image',
      selectQuery: internalColumnName.join(','),
      expandQuery: expandColumnName.join(','),
      filterQuery: filterQuery
    };
    await this.ServiceInatance.getAllListItems(SitePagesList).then((pageData) => {
      if (pageData && pageData.length > 0) {
        console.log("Content data type is >>>>>>>>>>>>>", pageData);
        this.setState({ list: pageData, isDataLoading: false,
          CardTitle: myParamtitle });
      }
    }).catch((error) => {
      console.log(error);
      this.setState({
        isDataLoading: false
      });
    });
  }
  public render(): React.ReactElement<IPromotionalFoldersProps> {
    document.documentElement.style.setProperty("--button-color", this.state.buttonColor);
    var titlealias = window.location.protocol;
    let str = this.props.webparttitle;
    str = str.replace(/\s+/g, '-').toLowerCase();
    let weburl = this.props.apiURL;
    var CardTitle = this.state.CardTitle.replace('-', ' ').toUpperCase();
    var pagelink = this.props.context.pageContext.web.absoluteUrl;  
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
              <a href={pagelink} style={{ textDecoration: 'none' }} className="d-block"><p className="CardTitle">{CardTitle}</p></a>
              </div>
               <div className='col-md-8'></div>
                {
                  this.state.list.map((detail, index) => {
                    let imgSrc = detail.ImageThumbnail;
                    var title = (detail.Title).replace(/\s+/g, '-');
                    var subtitle = (detail.Title).replace('-', " ");
                    return (
                      <div key={index} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3">
                      <div className="card" onClick={() => window.open((this.props.context.pageContext.web.absoluteUrl + `/SitePages/ImageGallery.aspx?category=${title}`), "_blank")}>
                          <img src={JSON.parse(imgSrc).serverRelativeUrl} alt="imageCard" className="imageCard" />
                          <div className="imageContent row-no-padding">
                                <div className="row align-items-end">
                                  <div className="col-9 col-md-9">
                                    <h3 className="mb-0">{subtitle}</h3>
                                  </div>
                                  <div className="col-3 col-md-3 text-right">
                                    <a href="javascript:void(0);" target="_blank" style={{ textDecoration: 'none' }} className="d-block" onClick={(e) => { e.preventDefault(); window.open(this.props.context.pageContext.web.absoluteUrl + `/SitePages/ImageGallery.aspx?category=${title}`); return false; }}>View all</a>
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
