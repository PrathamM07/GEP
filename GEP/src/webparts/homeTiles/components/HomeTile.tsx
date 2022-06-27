import * as React from "react";
export const HomeTile = (props) => {
  const mediaLink = props.media;
  const mediaType = props.mediaType;
  const StartStop = (action: string) => {
    if (action.toLowerCase() === "play")
      document.getElementById("media").style.display = "block";
    else document.getElementById("media").style.display = "none";

    if (mediaType && mediaType.toLowerCase() === "audio") {
      if (action.toLowerCase() === "play") {
        document.querySelector(
          ".video-popup .video-popup__inner .video-con"
        ).innerHTML =
          "<audio src=" + mediaLink + ' controls autoPlay preload="none" />';
      } else {
        document.querySelector(
          ".video-popup .video-popup__inner .video-con"
        ).innerHTML =
          "<audio src=" + mediaType + ' controls pause preload="none"/>';
      }
    } else {
      if (action.toLowerCase() === "play") {
        document.querySelector(
          ".video-popup .video-popup__inner .video-con"
        ).innerHTML = "<video src=" + mediaLink + " controls autoPlay  />";
      } else {
        document.querySelector(
          ".video-popup .video-popup__inner .video-con"
        ).innerHTML =
          "<video src=" + mediaType + ' controls pause preload="none" />';
      }
    }
  };

  const onImageClick = (param, mediaType) => {
    if (
      mediaType.toLowerCase() === "audio" ||
      mediaType.toLowerCase() === "video"
    ) {
      StartStop("play");
    } else window.location.href = param;
  };

  return (
    <div className="card">
      <img
        src={props.image}
        alt="imageCard"
        className="imageCard"
        onClick={() => {
          onImageClick(props.redirectUrl, props.mediaType.toLowerCase());
        }}
      />
      {props.mediaType &&
        (props.mediaType.toLowerCase() === "audio" ||
          props.mediaType.toLowerCase() === "video") && (
          <img
            className="play"
            src={props.playIconUrl}
            alt="playButton"
            onClick={() => {
              StartStop("play");
            }}
          />
        )}
      <div className="imageContent row-no-padding">
        <div className="row align-items-end">
          <div className="col-9 col-md-9">
            <h3 className="mb-0">{props.title}</h3>
          </div>
          {props.view === "" ? (
            ""
          ) : (
            <div className="col-3 col-md-3 text-right">
              <a href={props.redirectUrl} className="d-block">
                {" "}
                {props.view}
              </a>
            </div>
          )}
        </div>
      </div>

      {props.mediaType &&
        (props.mediaType.toLowerCase() === "audio" ||
          props.mediaType.toLowerCase() === "video") && (
          <div className="video-popup" id="media">
            <div className="video-popup__inner">
              <span
                className="close__button"
                onClick={() => {
                  StartStop("close");
                }}
              >
                &times;
              </span>
              <div className="video-con"></div>
            </div>
          </div>
        )}
    </div>
  );
};
