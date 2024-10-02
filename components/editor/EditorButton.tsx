"use client";
import React, { useMemo } from "react";
import { Button } from "../ui/button";
import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  ListX,
  Redo,
  RemoveFormatting,
  Strikethrough,
  TextQuote,
  Undo,
} from "lucide-react";
import { ButtonVariant } from "@/enums";
import { cn } from "@/lib/utils";

export enum EditorButtonType {
  Bold = "bold",
  Italic = "italic",
  Strike = "strike",
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  Paragraph = "paragraph",
  BulletList = "bulletList",
  OrderedList = "orderedList",
  Undo = "undo",
  Redo = "redo",
  BlockQuote = "blockquote",
  ClearMarks = "clearMarks",
  ClearNodes = "clearNodes",
  AlignLeft = "left",
  AlignCenter = "center",
  AlignRight = "right",
}

interface EditorButtonProps {
  type: EditorButtonType;
  editor: Editor;
}

const EditorButton = ({ type, editor }: EditorButtonProps) => {
  const performAction = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    action: () => boolean
  ) => {
    e.preventDefault();
    action();
  };

  const { icon, action, isDisabled, isActive } = useMemo(() => {
    let icon: React.ReactNode;
    let action: () => boolean = () => false;
    let isDisabled: () => boolean = () => false;
    let isActive: () => boolean = () => false;

    switch (type) {
      case EditorButtonType.Bold:
        icon = <Bold />;
        action = () => editor.chain().focus().toggleBold().run();
        isDisabled = () => !editor.can().chain().focus().toggleBold().run();
        isActive = () => editor.isActive(EditorButtonType.Bold);
        break;
      case EditorButtonType.Italic:
        icon = <Italic />;
        action = () => editor.chain().focus().toggleItalic().run();
        isDisabled = () => !editor.can().chain().focus().toggleItalic().run();
        isActive = () => editor.isActive(EditorButtonType.Italic);
        break;
      case EditorButtonType.Strike:
        icon = <Strikethrough />;
        action = () => editor.chain().focus().toggleStrike().run();
        isDisabled = () => !editor.can().chain().focus().toggleStrike().run();
        isActive = () => editor.isActive(EditorButtonType.Strike);
        break;
      case EditorButtonType.H1:
        icon = <Heading1 />;
        action = () => editor.chain().focus().toggleHeading({ level: 1 }).run();
        isDisabled = () =>
          !editor.can().chain().focus().toggleHeading({ level: 1 }).run();
        isActive = () => editor.isActive("heading", { level: 1 });
        break;
      case EditorButtonType.H2:
        icon = <Heading2 />;
        action = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
        isDisabled = () =>
          !editor.can().chain().focus().toggleHeading({ level: 2 }).run();
        isActive = () => editor.isActive("heading", { level: 2 });
        break;
      case EditorButtonType.H3:
        icon = <Heading3 />;
        action = () => editor.chain().focus().toggleHeading({ level: 3 }).run();
        isDisabled = () =>
          !editor.can().chain().focus().toggleHeading({ level: 3 }).run();
        isActive = () => editor.isActive("heading", { level: 3 });
        break;
      case EditorButtonType.Paragraph:
        icon = <div className="text-white-1 text-16 w-[1.5rem]">P</div>;
        action = () => editor.chain().focus().setParagraph().run();
        isDisabled = () => !editor.can().chain().focus().setParagraph().run();
        isActive = () => editor.isActive("paragraph");
        break;
      case EditorButtonType.BulletList:
        icon = <List />;
        action = () => editor.chain().focus().toggleBulletList().run();
        isDisabled = () =>
          !editor.can().chain().focus().toggleBulletList().run();
        isActive = () => editor.isActive(EditorButtonType.BulletList);
        break;
      case EditorButtonType.OrderedList:
        icon = <ListOrdered />;
        action = () => editor.chain().focus().toggleOrderedList().run();
        isDisabled = () =>
          !editor.can().chain().focus().toggleOrderedList().run();
        isActive = () => editor.isActive(EditorButtonType.OrderedList);
        break;
      case EditorButtonType.Undo:
        icon = <Undo />;
        action = () => editor.chain().focus().undo().run();
        isDisabled = () => !editor.can().chain().focus().undo().run();
        break;
      case EditorButtonType.Redo:
        icon = <Redo />;
        action = () => editor.chain().focus().redo().run();
        isDisabled = () => !editor.can().chain().focus().redo().run();
        break;
      case EditorButtonType.BlockQuote:
        icon = <TextQuote />;
        action = () => editor.chain().focus().toggleBlockquote().run();
        isDisabled = () =>
          !editor.can().chain().focus().toggleBlockquote().run();
        isActive = () => editor.isActive(EditorButtonType.BlockQuote);
        break;
      case EditorButtonType.ClearMarks:
        icon = <RemoveFormatting />;
        action = () => editor.chain().focus().unsetAllMarks().run();
        isDisabled = () => !editor.can().chain().focus().unsetAllMarks().run();
        isActive = () => editor.isActive(EditorButtonType.ClearMarks);
        break;
      case EditorButtonType.ClearNodes:
        icon = <ListX />;
        action = () => editor.chain().focus().clearNodes().run();
        isDisabled = () => !editor.can().chain().focus().clearNodes().run();
        isActive = () => editor.isActive(EditorButtonType.ClearNodes);
        break;
      case EditorButtonType.AlignLeft:
        icon = <AlignLeft />;
        action = () =>
          editor.chain().focus().setTextAlign(EditorButtonType.AlignLeft).run();
        isDisabled = () =>
          !editor
            .can()
            .chain()
            .focus()
            .setTextAlign(EditorButtonType.AlignLeft)
            .run();
        isActive = () =>
          editor.isActive({ textAlign: EditorButtonType.AlignLeft });
        break;
      case EditorButtonType.AlignCenter:
        icon = <AlignCenter />;
        action = () =>
          editor
            .chain()
            .focus()
            .setTextAlign(EditorButtonType.AlignCenter)
            .run();
        isDisabled = () =>
          !editor
            .can()
            .chain()
            .focus()
            .setTextAlign(EditorButtonType.AlignCenter)
            .run();
        isActive = () =>
          editor.isActive({ textAlign: EditorButtonType.AlignCenter });
        break;
      case EditorButtonType.AlignRight:
        icon = <AlignRight />;
        action = () =>
          editor
            .chain()
            .focus()
            .setTextAlign(EditorButtonType.AlignRight)
            .run();
        isDisabled = () =>
          !editor
            .can()
            .chain()
            .focus()
            .setTextAlign(EditorButtonType.AlignRight)
            .run();
        isActive = () =>
          editor.isActive({ textAlign: EditorButtonType.AlignRight });
        break;
      default:
        break;
    }

    return {
      icon,
      action,
      isDisabled,
      isActive,
    };
  }, [type, editor]);

  if (isDisabled()) {
    return <></>;
  }

  return (
    <Button
      disabled={isDisabled()}
      className={cn(
        "editor-button",
        isActive() ? "outline outline-[3px] outline-primary" : ""
      )}
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
        performAction(e, action)
      }
      variant={ButtonVariant.Editor}
    >
      {icon}
    </Button>
  );
};

export default EditorButton;
