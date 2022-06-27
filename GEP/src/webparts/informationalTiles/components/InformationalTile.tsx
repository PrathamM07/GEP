import * as React from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export const InformationalTile = (props) => {
  let _btnTitle;
  let _fileName = props.serviceTitle;
  let _dUrl = props.downloadUrl;
  let _tilesType = props.tilesType ? props.tilesType.toLowerCase() : "";

  if (props.tilesType) {
    _btnTitle = props.tilesType.toLowerCase();

    if (_btnTitle === "video") _btnTitle = "Watch Now";
    else if (_btnTitle === "audio") _btnTitle = "Listen Now";
    else _btnTitle = "Read More";
  }

  const clicked = (_url, tilesType) => {
    if (tilesType === "link") window.open(_url);
    else FetchFile(_url, tilesType);
  };

  const FetchFile = (fileUrl, tilesType) => {
    let formData = new FormData();
    formData.append("usragent", "ipad_retina");
    formData.append("title_alias", props.title);
    formData.append("usrcode", "85");
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    axios.post(fileUrl, formData, config).then((response) => {
      let fileDownloadUrl = response.data.data[0].download_url;
      if (tilesType === "document") downloadFile(fileDownloadUrl);
      if (tilesType === "audio" || tilesType === "video")
        StartStop("play", tilesType, fileDownloadUrl);
    });
  };

  const downloadFile = (fileUrl) => {
    axios({
      url: fileUrl, //your url
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      saveAs(response.data, _fileName);
    });
  };

  const StartStop = (action, tilesType, fileDownloadUrl) => {
    if (action.toLowerCase() === "play")
      document.getElementById("media").style.display = "block";
    else document.getElementById("media").style.display = "none";

    if (tilesType === "audio") {
      if (action === "play") {
        document.querySelector(
          ".video-popup .video-popup__inner .video-con"
        ).innerHTML =
          "<audio src=" +
          fileDownloadUrl +
          ' controls autoPlay preload="none" />';
      } else {
        document.querySelector(
          ".video-popup .video-popup__inner .video-con"
        ).innerHTML = '<audio src="" controls pause preload="none"/>';
      }
    } else {
      if (action.toLowerCase() === "play") {
        document.querySelector(
          ".video-popup .video-popup__inner .video-con"
        ).innerHTML =
          "<video src=" + fileDownloadUrl + " controls autoPlay  />";
      } else {
        document.querySelector(
          ".video-popup .video-popup__inner .video-con"
        ).innerHTML = '<video src="" controls pause preload="none" />';
      }
    }
  };

  return (
    <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
      <button
        type="button"
        className="Readmorebtn"
        onClick={() => {
          clicked(_dUrl, _tilesType);
        }}
      >
        {_btnTitle}&nbsp;&nbsp;
        <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
              <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
      </button>
      <div className="Detailcard">
        <img src={props.image} alt={props.title} className="imageCard" />
        {props.tilesType &&
          (props.tilesType.toLowerCase() === "audio" ||
            props.tilesType.toLowerCase() === "video") && (
            <img
              className="play"
              src={props.playIconUrl}
              alt="playButton"
              onClick={() => {
                FetchFile(_dUrl, _tilesType);
              }}
            />
          )}
        <div className="clickbtn">
          <p className="TilesTitle">{props.serviceTitle}</p>
        </div>
      </div>
      {(_tilesType === "audio" || _tilesType === "video") && (
        <div className="video-popup" id="media">
          <div className="video-popup__inner" id="video-popup__inner">
            <span
              className="close__button"
              onClick={() => {
                StartStop("close", _tilesType, "");
              }}
            >
              &times;
            </span>
            <div className="video-con" id="video-con"></div>
          </div>
        </div>
      )}
      <br />
    </div>
  );
};
