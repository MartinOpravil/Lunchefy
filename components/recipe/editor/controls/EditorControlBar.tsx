"use client";

import { Editor } from "@tiptap/react";

import ColorEditorButton from "@/components/recipe/editor/controls/ColorEditorButton";
import EditorButton, {
  EditorButtonType,
} from "@/components/recipe/editor/controls/EditorButton";
import { Skeleton } from "@/components/ui/skeleton";

interface EditorControlBarProps {
  editor: Editor | null;
}

const EditorControlBar = ({ editor }: EditorControlBarProps) => {
  const skeletonClasses = "h-8 w-8 bg-gray-200";

  return (
    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
      <div className="flex flex-wrap gap-1">
        {editor ? (
          <>
            <EditorButton editor={editor} type={EditorButtonType.Bold} />
            <EditorButton editor={editor} type={EditorButtonType.Italic} />
            <EditorButton editor={editor} type={EditorButtonType.Strike} />
            {/* <EditorButton editor={editor} type={EditorButtonType.Paragraph} /> */}
            <EditorButton editor={editor} type={EditorButtonType.H1} />
            <EditorButton editor={editor} type={EditorButtonType.H2} />
            <EditorButton editor={editor} type={EditorButtonType.H3} />
            <EditorButton editor={editor} type={EditorButtonType.BulletList} />
            <EditorButton editor={editor} type={EditorButtonType.OrderedList} />
            <EditorButton editor={editor} type={EditorButtonType.BlockQuote} />
          </>
        ) : (
          <>
            <Skeleton className={skeletonClasses} />
            <Skeleton className={skeletonClasses} />
            <Skeleton className={skeletonClasses} />
            <Skeleton className={skeletonClasses} />
            <Skeleton className={skeletonClasses} />
            <Skeleton className={skeletonClasses} />
          </>
        )}
      </div>
      <div className="flex flex-wrap justify-end gap-1">
        {editor ? (
          <>
            <EditorButton editor={editor} type={EditorButtonType.AlignLeft} />
            <EditorButton editor={editor} type={EditorButtonType.AlignCenter} />
            <EditorButton editor={editor} type={EditorButtonType.AlignRight} />
            <ColorEditorButton editor={editor} />
            <EditorButton editor={editor} type={EditorButtonType.ClearMarks} />
            <EditorButton editor={editor} type={EditorButtonType.ClearNodes} />
            <EditorButton editor={editor} type={EditorButtonType.Undo} />
            <EditorButton editor={editor} type={EditorButtonType.Redo} />
          </>
        ) : (
          <>
            <Skeleton className={skeletonClasses} />
            <Skeleton className={skeletonClasses} />
            <Skeleton className={skeletonClasses} />
            <Skeleton className={skeletonClasses} />
          </>
        )}
      </div>
    </div>
  );
};

export default EditorControlBar;
