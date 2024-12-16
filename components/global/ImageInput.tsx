"use client";
import React, {
  Dispatch,
  forwardRef,
  Ref,
  SetStateAction,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { Ban, CloudUpload, Loader, Trash2 } from "lucide-react";
import { ImageInputHandle, ImageStateProps } from "@/types";
import { FormLabel } from "../ui/form";
import { Id } from "@/convex/_generated/dataModel";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslations } from "next-intl";
import { notifyError } from "@/lib/notifications";
import { convertImageToWebP } from "@/lib/image";
import ActionButton from "./ActionButton";
import { ButtonVariant } from "@/enums";

interface ImageInputProps {
  image?: ImageStateProps;
  setImage: Dispatch<SetStateAction<ImageStateProps | undefined>>;
  label?: string;
  isVerified?: boolean;
}

const maxFileSizeMB = 1;

const ImageInput = (
  { image, setImage, label = "Image", isVerified = false }: ImageInputProps,
  ref: Ref<ImageInputHandle>
) => {
  const t = useTranslations("Global");

  const inputRef = useRef<HTMLInputElement>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isImageConverting, setIsImageConverting] = useState(false);
  const [isImageDeleting, setIsImageDeleting] = useState(false);
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const deleteFile = useMutation(api.files.deleteFile);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getImageUrl = useMutation(api.files.getUrl);
  const [imageStorageIdBackup, setImageStorageIdBackup] = useState(
    image?.storageId
  );
  const [imageBlob, setImageBlob] = useState<
    { blob: Blob; fileName: string } | undefined
  >(undefined);

  const commit = async () => {
    console.log("Committing...");
    if (!image?.imageUrl.startsWith("blob") || !imageBlob) return;

    setIsImageLoading(true);
    try {
      const file = new File([imageBlob.blob], imageBlob.fileName, {
        type: "image/png",
      });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      const imageUrl = await getImageUrl({ storageId });

      setImage({
        imageUrl: imageUrl ?? "",
        storageId: storageId,
      });

      setIsImageLoading(false);
      return {
        imageUrl: imageUrl,
        storageId: storageId,
      } as ImageStateProps;
    } catch (error) {
      console.log(error);
      setIsImageLoading(false);
      return;
    }
  };

  useImperativeHandle(ref, () => ({
    commit: async () => {
      return await commit();
    },
    getImageBlob: () => {
      return imageBlob?.blob;
    },
  }));

  const changeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsImageLoading(true);
    try {
      const files = e.target.files;
      if (!files) return;
      let file = files[0];

      if (file.type !== "image/webp") {
        setIsImageConverting(true);
        file = await convertImageToWebP(file);
        setIsImageConverting(false);
      }

      if (file.size > maxFileSizeMB * 1024 * 1024) {
        setIsImageLoading(false);
        return notifyError(t("Image.TooBigNotification"));
      }
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
      setImageBlob({
        blob: blob,
        fileName: file.name,
      });

      const imageUrl = URL.createObjectURL(blob);
      setImage({
        imageUrl: imageUrl,
        storageId: image?.storageId,
      });
      setIsImageLoading(false);
    } catch (error) {
      console.log(error);
      setIsImageLoading(false);
    }
  };

  const handleFileRemoval = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    // setIsImageDeleting(true)
    // if (image?.storageId) {
    //   await deleteFile({storageId: image.storageId})
    // }
    setImage(undefined);
    // setIsImageDeleting(false)
  };

  const handleFileOpen = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    inputRef?.current?.click();
  };

  return (
    <div className="image-input relative">
      {label && <FormLabel className="input-label">{label}</FormLabel>}
      {!isVerified ? (
        <div className="relative flex justify-center items-center p-6 min-h-[160px]">
          {image?.imageUrl && (
            <Image
              src={image.imageUrl}
              alt="thumbnail"
              width={0}
              height={0}
              sizes="100vw"
              className="w-[100%] h-[100%] sm:w-[50%] max-h-[500px] object-contain"
            />
          )}
          <div className="absolute top-0 left-0 w-full h-full flex flex-col gap-2 justify-center items-center bg-primary/50 rounded text-white-1 p-6 backdrop-blur-sm">
            <Ban />
            <div className="text-center">{t("Image.NoAccess")}</div>
          </div>
        </div>
      ) : (
        <div>
          <Input
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={(e) => changeImage(e)}
            accept="image/*"
          />
          {image?.imageUrl ? (
            <div className="image-input-inner !cursor-default relative">
              <div className="absolute top-1 left-1 bottom-1 flex flex-col gap-2 flex-wrap justify-between w-full">
                <ActionButton
                  icon={<CloudUpload />}
                  title={t("Image.ChangeImage")}
                  onClick={handleFileOpen}
                  classList="outline-[#CECECE] hover:outline-primary"
                />
                <ActionButton
                  icon={
                    <Trash2 className="group-hover:text-primary transition-all" />
                  }
                  onClick={handleFileRemoval}
                  variant={ButtonVariant.Negative}
                  classList="outline-[#CECECE]"
                />
              </div>
              {(isImageLoading || isImageConverting) && (
                <div className="absolute z-50 flex flex-col justify-center items-center text-16 flex-center font-medium text-white-1 p-2 bg-primary rounded-lg">
                  <Loader size={30} className="animate-spin text-white-1" />
                  {isImageConverting
                    ? t("Image.Converting")
                    : t("Image.Uploading")}
                </div>
              )}
              <div className="flex-center w-full rounded-lg overflow-hidden">
                <Image
                  src={image.imageUrl}
                  alt="thumbnail"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-[100%] h-[100%] sm:w-[50%] max-h-[500px] object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="image-input-inner" onClick={handleFileOpen}>
              <div className="flex flex-col items-center gap-1">
                {isImageLoading || isImageConverting ? (
                  <div className="flex flex-col justify-center items-center text-16 flex-center font-medium text-primary">
                    <Loader size={30} className="animate-spin text-black-1" />
                    {isImageConverting
                      ? t("Image.Converting")
                      : t("Image.Uploading")}
                  </div>
                ) : (
                  <>
                    <CloudUpload className="text-primary !w-14 !h-14" />
                    <h2 className="text-14 font-bold text-primary">
                      {t("Image.Title")}
                    </h2>
                    <p className="text-12 font-normal text-[gray-1] text-center">
                      {t("Image.Description")}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default forwardRef<ImageInputHandle, ImageInputProps>(ImageInput);
