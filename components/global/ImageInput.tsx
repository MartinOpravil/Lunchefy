"use client";
import React, { useRef, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { Loader } from "lucide-react";
import { ImageInputProps } from "@/types";
import { FormLabel } from "../ui/form";
import { Id } from "@/convex/_generated/dataModel";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const ImageInput = ({
  image,
  setImage,
  label = "Image",
  title = "Click to upload",
  description = "SVG, PNG, JPG or GIF",
}: ImageInputProps) => {
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

  const handleImage = async (
    blob: Blob,
    fileName: string,
    previousImageStorageId?: Id<"_storage">
  ) => {
    setIsImageLoading(true);

    if (
      previousImageStorageId &&
      previousImageStorageId !== imageStorageIdBackup
    ) {
      await deleteFile({ storageId: previousImageStorageId });
    }

    setImage(undefined);

    try {
      const file = new File([blob], fileName, { type: "image/png" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setImageStorageId(storageId);

      const imageUrl = await getImageUrl({ storageId });
      setImage({
        imageUrl: imageUrl ?? "",
        storageId: storageId,
      });
      setIsImageLoading(false);
      // toast({
      //   title: "Thumbnail generated",
      // });
    } catch (error) {
      console.log(error);
      // toast({
      //   title: "Error generating thumbnail",
      //   variant: "destructive",
      // });
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
      handleImage(blob, file.name, image?.storageId);
    } catch (error) {
      console.log(error);
      // toast({
      //   title: "Error uploading image",
      //   variant: "destructive",
      // });
    }
  };

  return (
    <div className="image-input">
      {label && (
        <FormLabel className="text-16 font-bold text-accent">{label}</FormLabel>
      )}
      <div
        className="image-input-inner"
        onClick={() => inputRef?.current?.click()}
      >
        <Input
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={(e) => uploadImage(e)}
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
        {image && (
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
    </div>
  );
};

export default ImageInput;
