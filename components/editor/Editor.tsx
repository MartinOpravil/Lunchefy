import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import EditorControlBar from "./EditorControlBar";
import { Skeleton } from "../ui/skeleton";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { debounce } from "lodash";

interface EditorProps {
  value?: string;
  onContentChange: (content: string) => void;
}

const Editor = ({ value, onContentChange }: EditorProps) => {
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
    content: value,
    onUpdate: debounce((value) => {
      const updatedContent = value.editor.getHTML();
      onContentChange(updatedContent);
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
  }, [value, editor]);

  return (
    <>
      <div className="p-2 rounded border-2 border-accent bg-background focus-within:outline focus-within:outline-2 focus-within:outline-secondary focus-within:outline-offset-2 transition-all">
        <EditorControlBar editor={editor} />
        <div className="bg-accent h-[1px] w-full my-2" />
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