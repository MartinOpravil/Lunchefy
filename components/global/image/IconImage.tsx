import Image from "next/image";

export interface IconImageProps {
  name: string;
  width?: number;
  height?: number;
  opacity?: number;
}

const IconImage = ({
  name,
  width = 15,
  height = 15,
  opacity = 1,
}: IconImageProps) => {
  return (
    <Image
      src={`/icons/${name}.svg`}
      alt={name}
      width={width}
      height={height}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        opacity: opacity,
      }}
    />
  );
};

export default IconImage;
