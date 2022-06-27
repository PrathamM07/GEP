import * as React from "react";
export const PromotionalTile = (props: any) => {

  const showImage = (img) => {};

  return (
    <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
      <div className="card">
        <img src={props.image} alt="imageCard" className="imageCard" 
          onClick={() => showImage(props.image)} />
      </div>
    </div>
  );
};
