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
import { Ban, Loader } from "lucide-react";
import { ImageInputHandle, ImageStateProps } from "@/types";
import { FormLabel } from "../ui/form";
import { Id } from "@/convex/_generated/dataModel";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ImageInputProps {
  image?: ImageStateProps;
  setImage: Dispatch<SetStateAction<ImageStateProps | undefined>>;
  label?: string;
  title?: string;
  description?: string;
  isVerified?: boolean;
}

const ImageInput = (
  {
    image,
    setImage,
    label = "Image",
    title = "Click to upload",
    description = "SVG, PNG, JPG or GIF",
    isVerified = false,
  }: ImageInputProps,
  ref: Ref<ImageInputHandle>
) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
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
      const file = files[0];
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

  return (
    <div className="image-input relative">
      {label && (
        <FormLabel className="text-16 font-bold text-accent">{label}</FormLabel>
      )}
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
            <div className="text-center">
              You dont have a permission to upload or manage images. Contact a
              web admin to grant you a permission.
            </div>
          </div>
        </div>
      ) : (
        <div
          className="image-input-inner"
          onClick={() => inputRef?.current?.click()}
        >
          <Input
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={(e) => changeImage(e)}
          />

          <div className="flex flex-col items-center gap-1">
            {!isImageLoading ? (
              <>
                <Image
                  src="/icons/upload.svg"
                  width={40}
                  height={40}
                  alt="upload"
                />
                <h2 className="text-12 font-bold text-primary">{title}</h2>
                <p className="text-12 font-normal text-gray-1">{description}</p>
              </>
            ) : (
              <div className="flex flex-col justify-center items-center text-16 flex-center font-medium text-primary">
                <Loader size={30} className="animate-spin text-black-1" />
                Uploading
              </div>
            )}
          </div>
          {image?.imageUrl && (
            <div className="flex-center w-full ">
              <Image
                src={image.imageUrl}
                alt="thumbnail"
                width={0}
                height={0}
                sizes="100vw"
                className="w-[100%] h-[100%] sm:w-[50%] max-h-[500px] object-contain"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default forwardRef<ImageInputHandle, ImageInputProps>(ImageInput);
