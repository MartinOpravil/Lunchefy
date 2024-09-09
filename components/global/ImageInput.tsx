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
  imageUrl,
  setImageUrl,
  label,
  title = "Click to upload",
  description = "SVG, PNG, JPG or GIF (max. 1080x1080px)",
}: ImageInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getImageUrl = useMutation(api.files.getUrl);

  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true);
    setImageUrl("");

    try {
      const file = new File([blob], fileName, { type: "image/png" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setImageStorageId(storageId);

      const imageUrl = await getImageUrl({ storageId });
      setImageUrl(imageUrl!);
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
      handleImage(blob, file.name);
    } catch (error) {
      console.log(error);
      // toast({
      //   title: "Error uploading image",
      //   variant: "destructive",
      // });
    }
  };

  return (
    <div className="file-input">
      {label && (
        <FormLabel className="text-16 font-bold text-accent">{label}</FormLabel>
      )}
      <div onClick={() => inputRef?.current?.click()}>
        <Input
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={(e) => uploadImage(e)}
        />
        {!isImageLoading ? (
          <Image
            src="/icons/upload-image.svg"
            width={40}
            height={40}
            alt="upload"
          />
        ) : (
          <div className="text-16 flex-center font-medium text-white-1">
            Uploading
            <Loader size={20} className="animate-spin ml-2" />
          </div>
        )}
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-12 font-bold text-orange-1">{title}</h2>
          <p className="text-12 font-normal text-gray-1">{description}</p>
        </div>
        {imageUrl && (
          <div className="flex-center w-full ">
            <Image
              src={imageUrl}
              width={200}
              height={200}
              className="mt-5"
              alt="thumbnail"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageInput;
