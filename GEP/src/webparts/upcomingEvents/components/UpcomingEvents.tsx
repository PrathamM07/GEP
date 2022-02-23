import * as React from 'react';
//import styles from './UpcomingEvents.module.scss';
import { IUpcomingEventsProps } from './IUpcomingEventsProps';
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
import ReactLoading from "react-loading";

export interface IUpcomingEventsStates {
  list: IPageItem[];
  currentPageItems: IPageItem[];
  totalPages: number;
  items: IPageItem[];
  currentPage: number;
  dynamicUrl: string;
  defaultIcon: string;
  isDataLoading: boolean;
  buttonColor: string;
  events: IPageItem[];
  startDate: string;
  startTime: Date;
  endTime: Date;
  eventTitle: string;
  eventDescription: string;
  eventDate: string;
  location: string;
  category: string;
  eventImage: string;
}
export interface IPageItem {
  image_url: string;
  description: string;
  Title: string;
  ImageThumbnail: string;
  IconImage: string;
  Platform: string;
  Place: string;
  EventDate: Date;
  Category: string;
  Location: string;

}

export default class UpcomingEvents extends React.Component<IUpcomingEventsProps, IUpcomingEventsStates, {}> {

  public _ops: GDService;
  private ServiceInatance: GDService;
  public tempPageItems: IPageItem[] = [];
  public constructor(props: IUpcomingEventsProps, state: IUpcomingEventsStates) {
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
      eventTitle: '',
      eventDescription: '',
      category: '',
      location: '',
      startDate: null,
      startTime: null,
      endTime: null,
      eventDate: null,
      eventImage: "",
      events: []

    };
    this.getHomePageDetails = this.getHomePageDetails.bind(this);
    this.getIconDetails = this.getIconDetails.bind(this);

  }

  public async componentDidMount() {
   // this.getHomePageDetails();
    //this.getIconDetails();
   // this.getEventdata();
  }
  public async getHomePageDetails() {
    this.ServiceInatance = new GDService(this.props.context);
    const internalColumnName = ["Title", "ImageThumbnail", "ExternalApi", "Place", "Platform", "EventDate"];
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
  public async getEventdata() {


    this.ServiceInatance = new GDService(this.props.context);
    const listTitle = "Events";
    const TODAY: Date = new Date(Date.now());
    const internalColumnName = ["Category", "Location", "EventDate", "EndDate", "Title", "Attachments"];
    const orderByQuery = { columnName: "Modified", ascending: false };
    const topQuery = 2;
    const eventList: IAllItems = {
      listName: listTitle,
      selectQuery: internalColumnName.join(','),
      //expandQuery: expandColumnName.join(','),
      // filterQuery: filterQuery,
      topQuery: topQuery,
      orderByQuery: orderByQuery
    };

    var eventData = await this.ServiceInatance.getAllListItems(eventList);
    console.log("EventData", eventData);
    this.setState({
      events: eventData,
      eventTitle: eventData[0].Title ? eventData[0].Title : "",
      //eventDescription: eventData[0].EventDescription ? eventData[0].EventDescription :"",

      location: eventData[0].Location ? eventData[0].Location : "",
      category: eventData[0].Category ? eventData[0].Category : "",
      // startDate: ConvertedStartTime,
      // startTime: startDateTime,
      // endTime: endDateTime,
      isDataLoading: false
    });
  }

  public render(): React.ReactElement<IUpcomingEventsProps> {
    document.documentElement.style.setProperty("--button-color", this.state.buttonColor);
    var currentDateTime = new Date();
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
                    console.log("detail data", detail)
                    return (
                      <div key={index} className="contentcard col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3">
                        <div className="card">
                          <img src={JSON.parse(imgSrc).serverRelativeUrl} alt="imageCard" className="imageCard" />
                          {/* <div className="imageContent row-no-padding">
                            <div className="col-12 col-md-12 text-right">
                        
                                ADD TO CALENDER</a>
                              {/* <a onClick={(event) => this.handleOnChangeEvent(event, addToCalendarButtonParameter)} className="addtocalender">ADD TO CALENDER</a> */}
                          {/* </div>
                          </div> */}
                        </div>
                        <div className="container eventcontent">
                          <p >{this.state.category}</p>
                          <h3>{this.state.eventTitle}</h3>
                          <div className='dates'>
                            <h5>{this.state.startDate}</h5>
                            <p>{this.state.location}</p>
                        
                          </div>
                          <div className='addtocalender'>
                            <a href="javascript:void(0);" target="_blank" style={{ textDecoration: 'none' }} className="d-block" onClick={(e) => { e.preventDefault(); window.open(this.props.context.pageContext.web.absoluteUrl + `/Lists/Events/calendar.aspx?`); return false; }}>
                              {/* <a onClick={this.addEventToCalendar}> */}
                              ADD TO CALENDER +</a>
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

