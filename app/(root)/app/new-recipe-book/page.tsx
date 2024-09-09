"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import PageHeader from "@/components/global/PageHeader";
import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ActionButton from "@/components/global/ActionButton";
import LinkButton from "@/components/global/LinkButton";
import { createRecipeBook } from "@/convex/recipeBooks";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import Image from "next/image";
import { Id } from "@/convex/_generated/dataModel";
import { useUploadFiles } from "@xixixao/uploadstuff/react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Recipe book name must be at least 2 characters.",
  }),
});

const NewRecipeBookPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createRecipeBook = useMutation(api.recipeBooks.createRecipeBook);

  // Image handling
  const [imageUrl, setImageUrl] = useState("");
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  );

  const imageRef = useRef<HTMLInputElement>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const newRecipeBookId = await createRecipeBook({
        name: values.name,
        imgUrl: imageUrl,
      });
      if (newRecipeBookId) router.push("/app");
      setIsSubmitting(false);
    } catch (error) {
      console.log("Error creating recipe book", error);
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page">
      <PageHeader
        title="New recipe book"
        icon="recipe_book"
        actionButton={<LinkButton title="Back" icon="back" href="/app" />}
      />
      <main className="page-content">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col"
          >
            <div className="flex flex-col gap-[30px] pb-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="text-16 font-bold text-accent">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="input-class border-2 border-accent focus-visible:ring-secondary transition-all"
                        placeholder="New recipe book name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-primary" />
                  </FormItem>
                )}
              />
            </div>

            <div onClick={() => imageRef?.current?.click()}>
              <Input
                type="file"
                className="hidden"
                ref={imageRef}
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
                <h2 className="text-12 font-bold text-orange-1">
                  Click to upload
                </h2>
                <p className="text-12 font-normal text-gray-1">
                  SVG, PNG, JPG or GIF (max. 1080x1080px)
                </p>
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

            <div className="flex flex-col items-center">
              <ActionButton
                title="Save"
                isLoading={isSubmitting}
                classList="min-w-32"
                onClick={form.handleSubmit(onSubmit)}
              />
            </div>
          </form>
        </Form>
      </main>
    </main>
  );
};

export default NewRecipeBookPage;
