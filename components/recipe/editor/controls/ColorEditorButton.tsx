"use client";
import { Editor } from "@tiptap/react";
import React, { ChangeEvent, useRef } from "react";

import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ColorEditorButtonProps {
  editor: Editor;
}

const ColorEditorButton = ({ editor }: ColorEditorButtonProps) => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const convertToHex = (color?: string) => {
    if (!color) return "#000000";
    if (color.startsWith("#")) return color;
    const rgba = color.replace(/^rgba?\(|\s+|\)$/g, "").split(",");
    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    return `#${toHex(parseInt(rgba[0]))}${toHex(parseInt(rgba[1]))}${toHex(parseInt(rgba[2]))}`;
  };

  const performAction = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (colorInputRef.current) colorInputRef.current.click();
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    editor.chain().focus().setColor(event.target.value).run();
  };

  return (
    <div className="color-editor-button relative flex justify-center">
      <Button
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
          performAction(e)
        }
        variant={"editor"}
      >
        <Palette />
      </Button>
      <div
        className="absolute w-2.5 h-2.5 rounded-full bottom-0.5 right-0.5 pointer-events-none"
        style={{ backgroundColor: editor.getAttributes("textStyle").color }}
      />
      <input
        type="color"
        ref={colorInputRef}
        onInput={handleInput}
        value={convertToHex(editor.getAttributes("textStyle").color)}
        className="hidden"
      />
    </div>
  );
};

export default ColorEditorButton;
