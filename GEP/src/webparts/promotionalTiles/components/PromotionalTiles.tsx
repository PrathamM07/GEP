import * as React from "react";
import { IPromotionalTilesProps } from "./IPromotionalTilesProps";
import { escape } from "@microsoft/sp-lodash-subset";
import axios from "axios";
import GDService from "../../../Services/GetDataService";
import { Web } from "@pnp/sp/presets/all";
import "./../../../Frameworks/common/css/bootstrap.min.css";
import "./PromotionalFolder.css";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { sp } from "@pnp/sp/presets/all";
import { IAllItems } from "../../../Services/IListOperation";
import ReactLoading from "react-loading";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { PromotionalTile } from "./PromotionalTile";
import { HomeTile } from "../../homeTiles/components/HomeTile";
import { InformationalTile } from "../../informationalTiles/components/InformationalTile";
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class PromotionalTiles extends React.Component<IPromotionalTilesProps, any> {
  private ServiceInstance: GDService;
  private siteUrl = this.props.context.pageContext.web.absoluteUrl;
  public constructor(props: IPromotionalTilesProps, state: any) {
    super(props);
    this.state = {
      list: [],
      imageList: [],
      isDataLoading: true,
      buttonColor: "",
      isLightBoxDisplay: false,
      lightBoxImageUrl: "",
      CardTitle: "",
      showNext: false,
      showPrev: false,
    };
  }
  public componentDidMount() {
    this.loadData();
  }

  private getQueryStringValue(key) {
    const searchParams = new URLSearchParams(
      window.location.href.split("?")[1]
    );
    return searchParams.get(key)
    ? 
     decodeURIComponent(searchParams.get(key)) : null;
  }

  private loadData() {
    let _library = this.getQueryStringValue("l");
    let _folderPath = this.getQueryStringValue("f");
    let _libraryPath = _library;
    if (_folderPath && _folderPath.trim().length > 0) {
      _libraryPath += "/" + _folderPath;
      this.getFolderDetails(_libraryPath);
    } else this.getLibraryFolders(_library);
  }

  private getFolderDetails(libraryPath) {
    this.ServiceInstance = new GDService(this.props.context);
    let instance = this;
    this.ServiceInstance.getAllLibraryItemsByFolder(libraryPath)
      .then((data: any) => {
        if (data) {
          console.log("Folder Data", data);
          if (data && data.Files && data.Files.length > 0) {
            let _imgFiles = data.Files.filter((f) => {
              if (instance.isImage(f.Name) != null) return f;
            }).map((m) => {
              return m.ServerRelativeUrl;
            });
            this.setState({
              list: data.Files,
              imageList: _imgFiles,
              isDataLoading: false,
              CardTitle: libraryPath,
            });
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

  private getLibraryFolders(libraryName) {
    this.ServiceInstance = new GDService(this.props.context);
    this.ServiceInstance.getLibraryFolders(libraryName)
      .then((listData: any[]) => {
        console.log("List Data :", listData);
        this.setState({
          list: listData,
          isDataLoading: false,
          CardTitle: libraryName,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isDataLoading: false,
        });
      });
  }

  private getExtension(file) {
    return file.split(".")[1];
  }

  private isImage(file) {
    return file.match(/\.(jpg|jpeg|png|svg|gif)$/);
  }

  private getFileImage(file) {
    let _ext = this.getExtension(file);
    let _url = this.siteUrl + "/SiteAssets/images/";
    let _fileImage;
    switch (_ext) {
      case "txt":
        _fileImage = "txt.png";
        break;
      case "docx":
      case "doc":
        _fileImage = "docx.png";
        break;
      case "xlsx":
      case "xls":
        _fileImage = "xlsx.png";
        break;
      case "pdf":
        _fileImage = "pdf.png";
        break;
      default:
        _fileImage = "file.png";
        break;
    }
    return _url + _fileImage;
  }

  private showImage(image) {
    let currentIndex = this.state.imageList.indexOf(image);
    if (currentIndex === 0) {
      this.setState({
        lightBoxImageUrl: image,
        isLightBoxDisplay: true,
        showNext: true,
        showPrev: false,
      });
    } else if (currentIndex === this.state.imageList.length - 1) {
      this.setState({
        lightBoxImageUrl: image,
        isLightBoxDisplay: true,
        showNext: false,
        showPrev: true,
      });
    } else
      this.setState({
        lightBoxImageUrl: image,
        isLightBoxDisplay: true,
        showNext: true,
        showPrev: true,
      });
  }

  private hideLightBox() {
    this.setState({
      isLightBoxDisplay: false,
    });
  }

  private showNext() {
    let currentIndex = this.state.imageList.indexOf(
      this.state.lightBoxImageUrl
    );
    currentIndex++;
    let nextImage = this.state.imageList[currentIndex];
    if (currentIndex === 0) {
      this.setState({
        lightBoxImageUrl: nextImage,
        showNext: true,
        showPrev: false,
      });
    } else if (currentIndex === this.state.imageList.length - 1) {
      this.setState({
        lightBoxImageUrl: nextImage,
        showNext: false,
        showPrev: true,
      });
    } else {
      this.setState({
        lightBoxImageUrl: nextImage,
        showNext: true,
        showPrev: true,
      });
    }
  }

  private showPrev() {
    let currentIndex = this.state.imageList.indexOf(
      this.state.lightBoxImageUrl
    );
    currentIndex--;
    let prevImage = this.state.imageList[currentIndex];
    if (currentIndex === 0) {
      this.setState({
        lightBoxImageUrl: prevImage,
        showNext: true,
        showPrev: false,
      });
    } else if (currentIndex === this.state.imageList.length - 1) {
      this.setState({
        lightBoxImageUrl: prevImage,
        showNext: false,
        showPrev: true,
      });
    } else {
      this.setState({
        lightBoxImageUrl: prevImage,
        showNext: true,
        showPrev: true,
      });
    }
  }

  public render(): React.ReactElement<IPromotionalTilesProps> {
    document.documentElement.style.setProperty(
      "--button-color",
      this.state.buttonColor
    );
    return (
      <section className="section__content bg-white">
        {this.state.isDataLoading ? (
          <ReactLoading
            className="mainLoader"
            type="spin"
            color={this.state.buttonColor}
            width={"70px"}
            height={"70px"}
          />
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <a
                  href="#"
                  style={{ textDecoration: "none" }}
                  className="d-block"
                >
                  <p className="CardTitle">{this.state.CardTitle}</p>
                </a>
              </div>
              <div className="col-md-8"></div>
              {this.state.list.map((detail) => {
                let _thumbnail = detail.ListItemAllFields &&
                detail.ListItemAllFields.ImageThumbnail
                  ? JSON.parse(detail.ListItemAllFields.ImageThumbnail)
                      .serverRelativeUrl
                  : "";
                
                let _redirectUrl =
                  window.location.href.split("?")[0] +
                  "?l=" +
                  this.getQueryStringValue("l") +
                  "&f=" +
                  detail.Name;

                if (this.getQueryStringValue("f") === null)
                  return (
                    <HomeTile
                      image={_thumbnail}
                      title={detail.Name}
                      view="View All"
                      redirectUrl={_redirectUrl}
                    ></HomeTile>
                  );
                else {
                  let _fileType = this.getExtension(detail.Name);
                  let _isImage = this.isImage("." + _fileType);
                  if (_isImage != null) {
                    return (
                      <div
                        onClick={() => this.showImage(detail.ServerRelativeUrl)}
                      >
                        <PromotionalTile
                          image={detail.ServerRelativeUrl}
                          tilesType="image"
                        ></PromotionalTile>
                      </div>
                    );
                  } else {
                    let _image = this.getFileImage(detail.Name);
                    return (
                      <InformationalTile
                        title={detail.Name}
                        serviceTitle={detail.Name}
                        tilesType="link"
                        image={_image}
                        downloadUrl={
                          this.siteUrl +
                          "/_layouts/download.aspx?SourceUrl=" +
                          detail.ServerRelativeUrl
                        }
                        playIconUrl={
                          this.props.context.pageContext.web.absoluteUrl +
                          "/siteassets/images/play.png"
                        }
                      ></InformationalTile>
                    );
                  }
                }
              })}

              {this.state.isLightBoxDisplay === true && (
                <div
                  id="lightbox"
                  onClick={() => {
                    // this.hideLightBox();
                  }}
                >
                  {this.state.showPrev === true && (
                    <button
                      onClick={() => {
                        this.showPrev();
                      }}
                    >
                   <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>
                    </button>
                  )}
                  <img id="lightbox-img" src={this.state.lightBoxImageUrl} />
                  {this.state.showNext === true && (
                    <button
                      onClick={() => {
                        this.showNext();
                      }}
                    >                   
                     <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    );
  }
}
