import * as React from 'react';
//import styles from './WhitePaperDetails.module.scss'
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

export interface IWhitePaperDetailsStates {
  list: IPageItem[];
  currentPageItems: IPageItem[];
  totalPages: number;
  items: IPageItem[];
  currentPage: number;
  dynamicUrl: string;
  defaultIcon: string;
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
      //assettype: []
    };
  }




  public componentDidMount() {

    this.getHomePageDetails();
    this.getIconDetails();
  }

  public async getHomePageDetails() {

    this.ServiceInatance = new GDService(this.props.context);

    const internalColumnName = ["Title", "ImageThumbnail", "ExternalApi"];
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
        console.log("promotional data is >>>>>>>>>>>>>", pageData);
        this.setState({ list: pageData });

        var listdata = pageData;
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
        //  isDataLoading: true
      });
    } catch (error) {
      console.log(error);

    }
  }

  public render(): React.ReactElement<IWhitePaperDetailsProps> {
    var titlealias = window.location.protocol;

    let str = this.props.webparttitle;



    // console.log("new list icon", this.state.list);
    return (
      <section className="section__content bg-white">
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

                //console.log("detailpage is ***",title);            
                return (

                  //   <div key={index} className="col-12 col-lg-4 col-md-6 col-sm-6 col-xl-3">
                  <div key={index} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3">
                    <div className="card">

                      <img src={JSON.parse(imgSrc).serverRelativeUrl} alt="imageCard" className="imageCard" />
                      {/* {(props.play === '') ? '' : <img className="play" src={props.play} alt="playButton" onClick={play} />}
                  */}
                      <div className="imageContent row-no-padding">
                        <div className="row align-items-end">
                          <div className="col-9 col-md-9">
                            <h3 className="mb-0">{subtitle}</h3>
                          </div>


                          <div className="col-3 col-md-3 text-right">
                            {(this.props.contenttype == "Promotional Content" || this.props.contenttype == "Informational Content") ?
                              <a href="javascript:void(0);" target="_blank" style={{ textDecoration: 'none' }} className="d-block" onClick={(e) => { e.preventDefault(); window.open(`https://prathameshneo.sharepoint.com/sites/GEP/SitePages/GepListing-Page.aspx?category=${title}`); return false; }}>View all</a>
                              :
                              <a href="#" ></a>
                            }
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
      </section>
    );
  }
}
