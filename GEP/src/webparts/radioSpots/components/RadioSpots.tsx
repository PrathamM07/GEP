import * as React from 'react';
import { IRadioSpotsProps } from './IRadioSpotsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp";
import { Web } from '@pnp/sp/presets/all';
import './../../../Frameworks/common/css/bootstrap.min.css';
import './RadioSpots.css';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IAllItems } from '../../../Services/IListOperation';
import axios from "axios";
import GDService from '../../../Services/GetDataService';
import ReactLoading from "react-loading";

export interface IRadioSpotsStates {
  list: IPageItem[];
  items: IPageItem[];
  defaultIcon: string;
  isDataLoading: boolean;
  buttonColor: string;
  CardTitle: string;
}

export interface IPageItem {
  Title: string;
  ImageThumbnail: string;
  IconImage: string;
  MediaItemLink: string;
  MediaType: string;

}
let mediaType: string;
export default class RadioSpots extends React.Component<IRadioSpotsProps,IRadioSpotsStates, {}> {
  private ServiceInatance: GDService;
  public tempPageItems: IPageItem[] = [];
  public constructor(props: IRadioSpotsProps, state: IRadioSpotsStates) {
    super(props);
    this.state = {
      list: [],
      items: [],
      defaultIcon: "",
      isDataLoading: true,
      buttonColor: props.buttonColor,
      CardTitle: '',
    };
    this.getRadioSpotsDetailsList = this.getRadioSpotsDetailsList.bind(this);
  }
    public async componentDidMount() {
      this.getRadioSpotsDetailsList();
    }
    public async getRadioSpotsDetailsList() {
      let category = window.location.href;
      var myParam = location.search.split('category=')[1];
      this.ServiceInatance = new GDService(this.props.context);
      const internalColumnName = ["Title", "ImageThumbnail", "IconImage", "MediaItemLink", "MediaType"];
      // let maxItems = this.props.maxItems;
      let web = Web(`${this.props.context.pageContext.web.absoluteUrl}/`);
      const SitePagesList: IAllItems = {
        listName: 'Radio Spots List',
       //listName:'Television Spots List',
        selectQuery: internalColumnName.join(','),
        // expandQuery: expandColumnName.join(','),
        // topQuery: parseInt(maxItems),
        // filterQuery: filterQuery
      };
      await this.ServiceInatance.getAllListItems(SitePagesList).then((pageData) => {
        if (pageData && pageData.length > 0) {
          console.log("Content data type is >>>>>>>>>>>>>", pageData);
          this.setState({ list: pageData, isDataLoading: false, CardTitle: myParam });
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
          // this.setState({ list: result.data.data[2].list });
        }
        );
    }
    public play(mediaitemlink: string, Mediatype: string)//get parameter from iconimage
    {
      document.getElementById('video-popup').style.display = 'block';
      mediaType = Mediatype;
      if (Mediatype == "Audio") { 
        document.querySelector('.video-popup .video-popup__inner .video-con').innerHTML = '<audio src=' + mediaitemlink + ' controls autoPlay preload="none" />';    
      }
    }

  public render(): React.ReactElement<IRadioSpotsProps> {
    document.documentElement.style.setProperty("--button-color", this.state.buttonColor);
    var CardTitle = this.state.CardTitle.replace('-', ' ').toUpperCase();
    var pagelink = this.props.context.pageContext.web.absoluteUrl;
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
                    return (
                      <div key={index} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
                        <div className="card">
                        <img src={JSON.parse(imgSrc).serverRelativeUrl} alt="imageCard" className="imageCard" />
                        {
                            (detail.IconImage === null) ?
                              ''
                              :
                              (detail.MediaType == 'Audio') ?
                                <img className="play" src={JSON.parse(detail.IconImage).serverRelativeUrl} alt="playButton" onClick={(event) => this.play(detail.MediaItemLink, detail.MediaType)} />
                                :
                                ''
                          }
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
