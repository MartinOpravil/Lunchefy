"use client";

import { Ref, forwardRef, useImperativeHandle, useRef, useState } from "react";

import LightboxYARL from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

export interface LightboxHandle {
  setOpen: (imageSrc?: string) => void;
}

interface LightboxProps {
  imageSrcList: string[];
}

const Lightbox = (
  { imageSrcList }: LightboxProps,
  ref: Ref<LightboxHandle>,
) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const fullscreenRef = useRef(null);
  const zoomRef = useRef(null);

  useImperativeHandle(ref, () => ({
    setOpen: (imageSrc?: string) => {
      const index = imageSrcList.findIndex((x) => x === imageSrc);
      if (index < 0) return;
      setIndex(index);
      setOpen(true);
    },
  }));

  return (
    <>
      <LightboxYARL
        plugins={[Zoom, Fullscreen]}
        open={open}
        index={index}
        close={() => setOpen(false)}
        fullscreen={{ ref: fullscreenRef }}
        zoom={{ ref: zoomRef, scrollToZoom: true, maxZoomPixelRatio: 5 }}
        slides={imageSrcList.map((imageSrc) => {
          return { src: imageSrc };
        })}
        render={{
          buttonPrev: imageSrcList.length > 1 ? undefined : () => null,
          buttonNext: imageSrcList.length > 1 ? undefined : () => null,
        }}
        styles={{ root: { "--yarl__color_backdrop": "rgba(0, 0, 0, .8)" } }}
      />
    </>
  );
};

// export default Lightbox;
export default forwardRef<LightboxHandle, LightboxProps>(Lightbox);
