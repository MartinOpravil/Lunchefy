const preferedImageMaxWidth = 1600;

export const convertImageToWebP = async (
  file: File,
  quality: number = 0.8
): Promise<File> => {
  if (!file.type.startsWith("image/")) {
    throw new Error("The provided file is not an image.");
  }

  const createImageBitmapPromise = (): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(file);

      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = (error) => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load the image."));
      };

      image.src = url;
    });
  };

  const image = await createImageBitmapPromise();

  const canvas = document.createElement("canvas");
  const scaleFactor =
    image.width > preferedImageMaxWidth
      ? image.width / preferedImageMaxWidth
      : 1;
  // console.log(`width: ${image.width}, scaleFactor: ${scaleFactor}`);
  canvas.width = image.width / scaleFactor;
  canvas.height = image.height / scaleFactor;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas rendering context.");
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const webpDataUrl = canvas.toDataURL("image/webp", quality);

  const response = await fetch(webpDataUrl);
  const blob = await response.blob();

  return new File([blob], `${file.name.split(".")[0]}.webp`, {
    type: "image/webp",
  });
};
