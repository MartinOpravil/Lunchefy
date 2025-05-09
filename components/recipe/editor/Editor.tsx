"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import BulletList from "@tiptap/extension-bullet-list";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { debounce } from "lodash";

import EditorControlBar from "@/components/recipe/editor/controls/EditorControlBar";
import { Skeleton } from "@/components/ui/skeleton";

interface EditorProps {
  value?: string;
  name: string;
}

const Editor = ({ value, name }: EditorProps) => {
  const { register, setValue, trigger, formState } = useFormContext();
  const editor = useEditor({
    extensions: [
      StarterKit,
      BulletList,
      ListItem,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    immediatelyRender: false,
    content: value,
    onUpdate: debounce(({ editor }) => {
      const updatedContent = editor.getHTML();
      setValue(name, updatedContent, { shouldDirty: true });
    }, 300),
    parseOptions: {
      preserveWhitespace: "full",
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm focus:outline-none w-full max-w-full",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    let { from, to } = editor.state.selection;
    editor.commands.setContent(value ?? "", false, {
      preserveWhitespace: "full",
    });
    editor.commands.setTextSelection({ from, to });
  }, [value, editor, register]);

  useEffect(() => {
    register(name, { required: true });
  }, [register, name]);

  return (
    <>
      <div className="input-class p-2">
        <EditorControlBar editor={editor} />
        <div className="heading-underline !my-[0.5rem]" />
        {editor ? (
          <EditorContent editor={editor} className="editor-content" />
        ) : (
          <Skeleton className="h-16 w-full bg-gray-200" />
        )}
      </div>
    </>
  );
};

export default Editor;
