// components/common/RichTextEditor.jsx

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const RichTextEditor = ({
  value = "",
  onChange,
  label=""
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],

    content: value,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

useEffect(() => {
  if (!editor) return;

  editor.commands.setContent(value);
}, [editor, value]);


  if (!editor) return null;

  return (
    <>
      <h2 className="text-md mb-2 font-medium">{label}</h2>
    <div className="border rounded-xl overflow-hidden">

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 border-b bg-muted">

        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
        >
          <Bold />
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
        >
          <Italic />
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            editor.chain().focus().toggleUnderline().run()
          }
        >
          <UnderlineIcon />
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 />
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 />
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List />
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered />
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
        >
          <Quote />
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            editor.chain().focus().undo().run()
          }
        >
          <Undo />
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            editor.chain().focus().redo().run()
          }
        >
          <Redo />
        </Button>

      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="min-h-62.5 p-4 prose max-w-none"
      />
    </div>
    </>
  );
};

export default RichTextEditor;