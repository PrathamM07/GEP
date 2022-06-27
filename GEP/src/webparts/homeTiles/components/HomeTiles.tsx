import * as React from "react";
import service from "../../../Services/GetDataService";
import "./../../../Frameworks/common/css/bootstrap.min.css";
import '../../../asset/Body.css';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IAllItems } from "../../../Services/IListOperation";
import { HomeTile as Tile } from "./HomeTile";
import { IHomeTilesProps } from "./IHomeTilesProps";
export default class HomeTiles extends React.Component<IHomeTilesProps,any> {
  private ServiceInstance: service;
  public constructor(props: IHomeTilesProps, state: any) {
    super(props);
    this.state = {
      list: [],
      items: [],
      defaultIcon: "",
      isDataLoading: true,
    };
    this.getHomePageDetails = this.getHomePageDetails.bind(this);
  }
  public render(): React.ReactElement<IHomeTilesProps> {
    document.documentElement.style.setProperty(
      "--button-color",
      this.state.buttonColor
    );
    return (
      <section className="section__content bg">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="heading">
                <img
                  src={this.props.HeadingIconUrl}
                  alt="icon"
                  className="icon"
                />
                {this.props.Title}
              </h2>
            </div>

            {this.state.list.map((tile, i) => {
              let _thumbnail = tile.ImageThumbnail
                ? JSON.parse(tile.ImageThumbnail).serverRelativeUrl
                : "";

                let _redirectUrl = tile.RedirectUrl ? tile.RedirectUrl.Url : "#";
                if (
                  this.props.TileCategory &&
                  this.props.TileCategory.toLowerCase().trim() === "informational"
                )
                  _redirectUrl += "?i=" + tile.ID;
                else _redirectUrl += "?l=" + tile.PromotionalLibraryTitle;

              return (
                <div
                  key={i}
                  className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3"
                >
                  <Tile
                    audio={tile.MediaItemLink}
                    image={_thumbnail}
                    title={tile.Title}
                    media={tile.MediaItemLink}
                    mediaType={tile.MediaType}
                    view="View All"
                    redirectUrl={_redirectUrl}
                    playIconUrl={this.props.PlayIconUrl}
                  ></Tile>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  public async componentDidMount() {
    this.getHomePageDetails();
  }

  public getHomePageDetails() {
    this.ServiceInstance = new service(this.props.context);
    const internalColumnName = [
      "Title",
      "ImageThumbnail",
      "ExternalDetailApi",
      "MediaItemLink",
      "MediaType",
      "ID",
      "RedirectUrl",
      "PromotionalLibraryTitle"
    ];

    const homeTilesQuery: IAllItems = {
      listName: "HomeTiles",
      selectQuery: internalColumnName.join(","),
      filterQuery: "TileCategory eq '" + this.props.TileCategory + "'",
    };
    this.ServiceInstance.getAllListItems(homeTilesQuery)
      .then((pageData) => {
        if (pageData && pageData.length > 0) {
          this.setState({ list: pageData, isDataLoading: false });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isDataLoading: false,
        });
      });
  }
}
