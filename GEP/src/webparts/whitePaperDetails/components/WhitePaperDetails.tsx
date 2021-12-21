import * as React from 'react';
import styles from './WhitePaperDetails.module.scss';
import { IWhitePaperDetailsProps } from './IWhitePaperDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import axios from "axios";
import GDService from '../../../Services/GetDataService';
import { IWeb } from '@pnp/sp/webs';
import './../../../Frameworks/common/css/bootstrap.min.css';
import './body.css'
import { Pagination } from './Pagination';

export interface IWhitePaperDetailsStates {

  list: IPageItem[];
  currentPageItems: IPageItem[];
  totalPages: number;
  items: IPageItem[];
  currentPage: number;


}
export interface IPageItem {
  service_title: string;
  image_url: string;
  description: string;
  title_alias: string;
}

export default class WhitePaperDetails extends React.Component<IWhitePaperDetailsProps, IWhitePaperDetailsStates> {

  public _ops: GDService;
  public tempPageItems: IPageItem[] = [];
  public constructor(props: IWhitePaperDetailsProps, state: IWhitePaperDetailsStates) {


    super(props);
    this.state = {
      list: [],
      currentPageItems: [],
      totalPages: 5,
      items: [],
      currentPage: 5



    };
  }

  public componentDidMount() {
    this.getDetails();

  }

  public render(): React.ReactElement<IWhitePaperDetailsProps> {

    // this._ops = this.props.context.serviceScope.consume(GDService.serviceKey);

    return (


      <section className="section__content bg-white">
        <div className="container">
          <div className="row">




            {
              this.state.list.slice(0, this.props.maxItem).map((detail, index) => {
                let imgSrc = detail.image_url;
                return (

                  // <div className="card border" style={{ width: '18rem', backgroundColor: 'black' }}>
                  //   <img className="card-img-top" src={imgSrc} alt="Card image cap" />

                  //   <div className="card-body text-white">
                  //     <h5 className="card-title">{detail.service_title}</h5>
                  //     {/* <p className="card-text">{detail.description}</p> */}

                  //     <a href="#" className="btn btn-primary">View More</a>
                  //   </div>
                  // </div>

                  <div key={index} className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3">
                    <div className="card" >
                      <img src={imgSrc} alt="imageCard" className="imageCard" />
                      {/* {(props.play === '') ? '' : <img className="play" src={props.play} alt="playButton" onClick={play} />}
                  */}
                      <div className="imageContent row-no-padding">
                        <div className="row align-items-end">
                          <div className="col-9 col-md-9">
                            {/* <h3 className="mb-0">{detail.service_title}</h3> */}
                          </div>
                          {/* {(props.view === '') ? '' : */}
                          <div className="col-3 col-md-3 text-right">

                            <a href="#" style={{textDecoration: 'none'}} className="d-block"> View More</a>

                          </div>
                          {/* //    } */}

                        </div>


                      </div>

                      {/* <div className="video-popup">
                    <div className="video-popup__inner">
                      <span className="close__button" onClick={closeButton}>&times;</span>
                      <div className="video-con">
                      </div>
                    </div>
                  </div> */}
                    </div>
                    <br></br>
                  </div>

                )
              })
            }



            {/* <div className="list-paging">
          <Pagination
            currentPage={this.state.currentPage}
            totalPages={this.state.totalPages}
            onChange={(page) => this.pagination(page, this.state.items)}
            limiter={3} // Optional - default value 3
          />
        </div> */}


          </div>
        </div>


      </section>
    )
  }

  // public pagination(crntPage, libraryData) {
  //   var startCount = (crntPage - 1) * viewCount;
  //   var endCount = crntPage * viewCount;
  //   let pagedArr = libraryData.slice(startCount, endCount);
  //   this.setState({
  //     currentPage: 1
  //   });
  //   //return pagedArr;
  //   let web = Web(`${this.props.context.pageContext.web.absoluteUrl}/`);
  //   this.mapPageData(pagedArr, web);
  // }




  private async getDetails() {

    axios.get(this.props.apiURL)
      .then((result) => {
        console.log('This is your data', result.data.data[2].list)
        this.setState({ list: result.data.data[2].list });


      }

      );
  }

}
