import * as React from "react";
import axios from "axios";
import GDService from "../../../Services/GetDataService";
import "./../../../Frameworks/common/css/bootstrap.min.css";
import "./DetailPage.css";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IAllItems } from "../../../Services/IListOperation";
import ReactLoading from "react-loading";
import { InformationalTile as Tile } from "./InformationalTile";
import { IInformationalTilesProps } from "./IInformationalTilesProps";

export default class InformationalTiles extends React.Component<IInformationalTilesProps, any> {
  private ServiceInstance: GDService;
  public constructor(props: IInformationalTilesProps, state: any) {
    super(props);
    this.state = {
      list: [],
      downloadUrl: "",
      externalDetailUrl: "",
      currentPage: 0,
      totalPages: 0,
      isDataLoading: true,
      tilesType: "",
      HeadingTitle: "",
    };
  }

  public componentDidMount() {
    this.getTilesById();
  }
  private getQueryStringValue(key) {
    const searchParams = new URLSearchParams(
      window.location.href.split("?")[1]
    );
    return searchParams.get(key);
  }

  private getTilesById() {
    let _id = this.getQueryStringValue("i");
    this.ServiceInstance = new GDService(this.props.context);
    const internalColumnName = [
      "ID",
      "ExternalDetailApi",
      "DownloadUrl",
      "Title",
      "MediaType",
    ];
    let filterQuery = `ID eq ${_id}`;
    const homeTilesQuery: IAllItems = {
      listName: "HomeTiles",
      selectQuery: internalColumnName.join(","),
      filterQuery: filterQuery,
    };
    this.ServiceInstance.getAllListItems(homeTilesQuery)
      .then((listData: any[]) => {
        if (listData && listData.length > 0) {
          let _externalUrl;
          let _dUrl;
          if (listData[0].ExternalDetailApi) {
            _externalUrl = listData[0].ExternalDetailApi.Url;
            _dUrl = listData[0].DownloadUrl ? listData[0].DownloadUrl.Url : "#";
            this.getExternalData(
              _externalUrl,
              _dUrl,
              listData[0].MediaType,
              listData[0].Title
            );
          }
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isDataLoading: false,
        });
      });
  }

  private getExternalData(externalUrl, downloadUrl, tilesType, title) {
    axios.get(externalUrl).then((result) => {
      console.log("api result", result.data);
      console.log("list page result", result.data.total_pages);
      let _cPage = this.state.currentPage;
      _cPage++;
      this.setState({
        list: result.data.data[2].list,
        isDataLoading: false,
        totalPages: result.data.total_pages,
        downloadUrl: downloadUrl,
        externalUrl: externalUrl,
        currentPage: _cPage,
        tilesType: tilesType,
        HeadingTitle: title,
      });
    });
  }

  private getNextPage(externalUrl, currentPage) {
    let _nPage = currentPage;
    _nPage++;
    axios
      .get(externalUrl, {
        params: {
          page: _nPage,
        },
      })
      .then((result) => {
        console.log("api result", result);
        this.setState({
          list: [...this.state.list, ...result.data.data[2].list],
          isDataLoading: false,
          currentPage: _nPage,
          totalPages: result.data.total_pages,
        });
      });
  }

  public render(): React.ReactElement<IInformationalTilesProps> {
    return (
      <section className="section__content bg-white">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <a style={{ textDecoration: "none" }} className="d-block">
                <p className="CardTitle">{this.state.HeadingTitle}</p>
              </a>
            </div>
          </div>
          <div className="row">
            {this.state.list.length > 0 &&
              this.state.list.map((detail, index) => {
                return (
                  <Tile
                    tilesType={this.state.tilesType}
                    title={detail.title_alias}
                    serviceTitle={detail.service_title}
                    image={detail.image_url}
                    downloadUrl={
                      this.state.downloadUrl + "/" + detail.title_alias
                    }
                    playIconUrl={
                      this.props.context.pageContext.web.absoluteUrl +
                      "/siteassets/images/play.png"
                    }
                  ></Tile>
                );
              })}
          </div>
          {this.state.totalPages > 1 &&
            this.state.totalPages !== this.state.currentPage && (
              <div className="loadbtn">
                {this.state.list && (
                  <button
                    className="loadmorebtn"
                    onClick={() => {
                      this.getNextPage(
                        this.state.externalUrl,
                        this.state.currentPage
                      );
                    }}
                  >
                    Load More...
                  </button>
                )}
              </div>
            )}
          {this.state.isDataLoading && (
            <ReactLoading
              className="mainLoader"
              type="spin"
              width={"70px"}
              height={"70px"}
            />
          )}
        </div>
      </section>
    );
  }
}
