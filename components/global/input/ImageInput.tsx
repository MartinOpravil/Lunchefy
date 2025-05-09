"use client";

import {
  Dispatch,
  Ref,
  SetStateAction,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { useTranslations } from "next-intl";
import Image from "next/image";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import {
  Ban,
  CloudUpload,
  ExternalLink,
  ImageUp,
  Loader,
  Trash2,
} from "lucide-react";

import ActionButton from "@/components/global/button/ActionButton";
import ChosenImage, {
  ChosenImageContent,
  ChosenImageVariant,
} from "@/components/global/image/ChosenImage";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ButtonVariant } from "@/enums";
import { convertImageToWebP } from "@/lib/image";
import { notifyError } from "@/lib/notifications";
import { ImageInputHandle, ImageStateProps } from "@/types";

enum ImageType {
  Uploaded = "uploaded",
  External = "external",
}

interface ImageInputProps {
  image?: ImageStateProps;
  setImage: Dispatch<SetStateAction<ImageStateProps | undefined>>;
  label?: string;
  isVerified?: boolean;
  formPropertyName: string;
}

const maxFileSizeMB = 1;

const ImageInput = (
  {
    image,
    setImage,
    label = "Image",
    isVerified = false,
    formPropertyName,
  }: ImageInputProps,
  ref: Ref<ImageInputHandle>,
) => {
  const t = useTranslations("Global");

  const [selectedTab, setSelectedTab] = useState(
    image?.externalUrl?.length ? ImageType.External : ImageType.Uploaded,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isImageConverting, setIsImageConverting] = useState(false);
  const [isImageDeleting, setIsImageDeleting] = useState(false);
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null,
  );
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const deleteFile = useMutation(api.files.deleteFile);
  const getImageUrl = useMutation(api.files.getUrl);
  const [imageStorageIdBackup, setImageStorageIdBackup] = useState(
    image?.storageId,
  );
  const [imageBlob, setImageBlob] = useState<
    { blob: Blob; fileName: string } | undefined
  >(undefined);

  const commit = async () => {
    if (selectedTab === ImageType.External) {
      return {
        imageUrl: undefined,
        storageId: undefined,
        externalUrl: image?.externalUrl,
      } as ImageStateProps;
    }

    if (!image?.imageUrl?.startsWith("blob") || !imageBlob)
      return {
        imageUrl: image?.imageUrl,
        storageId: image?.storageId,
        externalUrl: undefined,
      } as ImageStateProps;

    setIsImageLoading(true);
    try {
      const file = new File([imageBlob.blob], imageBlob.fileName, {
        type: "image/png",
      });

      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const storageId = (await result.json()).storageId;
      const imageUrl = await getImageUrl({ storageId });

      setImage({
        imageUrl: imageUrl ?? undefined,
        storageId: storageId,
        externalUrl: undefined,
      });

      setIsImageLoading(false);
      return {
        imageUrl: imageUrl,
        storageId: storageId,
        externalUrl: undefined,
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
        externalUrl: image?.externalUrl,
      });
      setIsImageLoading(false);
    } catch (error) {
      console.log(error);
      setIsImageLoading(false);
    }
  };

  const handleFileRemoval = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    // setIsImageDeleting(true)
    // if (image?.storageId) {
    //   await deleteFile({storageId: image.storageId})
    // }
    // setImage(undefined);
    setImage({
      imageUrl: undefined,
      storageId: undefined,
      externalUrl: image?.externalUrl,
    });
    // setIsImageDeleting(false)
  };

  const handleFileOpen = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.preventDefault();
    inputRef?.current?.click();
  };

  return (
    <div className="image-input relative">
      {label && <FormLabel className="input-label">{label}</FormLabel>}
      <Tabs value={selectedTab}>
        <TabsList className="mb-4 flex w-full flex-col transition-[height] sm:flex-row">
          <TabsTrigger
            value={ImageType.Uploaded}
            className="flex w-full gap-2 text-text"
            onMouseDown={() => setSelectedTab(ImageType.Uploaded)}
          >
            <ImageUp />
            {t("Image.UploadImage")}
          </TabsTrigger>
          <TabsTrigger
            value={ImageType.External}
            className="flex w-full gap-2 text-text"
            onMouseDown={() => setSelectedTab(ImageType.External)}
          >
            <ExternalLink />
            {t("Image.ExternalUrl")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value={ImageType.Uploaded}>
          {!isVerified ? (
            <div className="relative flex min-h-[160px] items-center justify-center p-6">
              {image?.imageUrl && (
                <Image
                  src={image.imageUrl}
                  alt="thumbnail"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="h-[100%] max-h-[500px] w-[100%] object-contain sm:w-[50%]"
                />
              )}
              <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-2 rounded bg-primary/50 p-6 text-white-1 backdrop-blur-sm">
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
                <div className="image-input-inner relative !cursor-default">
                  <div className="absolute bottom-1 left-1 top-1 flex w-full flex-col flex-wrap justify-between gap-2">
                    <ActionButton
                      icon={<CloudUpload />}
                      title={t("Image.ChangeImage")}
                      onClick={handleFileOpen}
                      classList="outline-accent hover:outline-primary"
                    />
                    <ActionButton
                      icon={
                        <Trash2 className="text-text transition-all group-hover:text-primary" />
                      }
                      onClick={handleFileRemoval}
                      variant={ButtonVariant.NegativeMinimalistic}
                      classList="outline-accent"
                    />
                  </div>
                  {(isImageLoading || isImageConverting) && (
                    <div className="text-16 flex-center absolute z-50 flex flex-col items-center justify-center rounded-lg bg-primary p-2 font-medium text-white-1">
                      <Loader size={30} className="animate-spin text-white-1" />
                      {isImageConverting
                        ? t("Image.Converting")
                        : t("Image.Uploading")}
                    </div>
                  )}
                  <div className="flex-center w-full overflow-hidden rounded-lg">
                    <ChosenImage
                      image={image}
                      variant={ChosenImageVariant.ImageInputPreview}
                      content={ChosenImageContent.Internal}
                    />
                  </div>
                </div>
              ) : (
                <div className="image-input-inner" onClick={handleFileOpen}>
                  <div className="flex flex-col items-center gap-1">
                    {isImageLoading || isImageConverting ? (
                      <div className="text-16 flex-center flex flex-col items-center justify-center font-medium text-primary">
                        <Loader
                          size={30}
                          className="animate-spin text-black-1"
                        />
                        {isImageConverting
                          ? t("Image.Converting")
                          : t("Image.Uploading")}
                      </div>
                    ) : (
                      <>
                        <CloudUpload className="!h-14 !w-14 text-primary" />
                        <h2 className="text-14 font-bold text-primary">
                          {t("Image.Title")}
                        </h2>
                        <p className="text-12 text-center font-normal text-[gray-1]">
                          {t("Image.Description")}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value={ImageType.External} className="flex flex-col gap-4">
          <Input
            className="input-class"
            placeholder={t("Image.ExternalImageUrl")}
            value={image?.externalUrl ?? ""}
            onChange={(x) => {
              // TODO: Fix dirty state even when changes are returned back to previous state
              // setValue(
              //   formPropertyName,
              //   {
              //     externalUrl: x.currentTarget.value.length
              //       ? x.currentTarget.value
              //       : undefined,
              //     imageUrl: image?.imageUrl?.length
              //       ? image.imageUrl
              //       : undefined,
              //     storageId: image?.storageId?.length
              //       ? image.storageId
              //       : undefined,
              //   },
              //   { shouldDirty: true }
              // );
              // Keeping this approach becouse it works more predictably:
              setImage({
                externalUrl: x.currentTarget.value.length
                  ? x.currentTarget.value
                  : undefined,
                imageUrl: image?.imageUrl?.length ? image.imageUrl : undefined,
                storageId: image?.storageId?.length
                  ? image.storageId
                  : undefined,
              });
            }}
          />
          <div className="text-center text-[12px] text-primary">
            {t("Image.ExternalImageDiclaimer")}
          </div>

          {image?.externalUrl && (
            <div className="flex-center w-full overflow-hidden rounded-lg border-transparent">
              <ChosenImage
                image={image}
                variant={ChosenImageVariant.ImageInputPreview}
                content={ChosenImageContent.External}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default forwardRef<ImageInputHandle, ImageInputProps>(ImageInput);
