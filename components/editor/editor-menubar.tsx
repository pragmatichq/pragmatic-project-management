import { useCurrentEditor } from "@tiptap/react";
import { useState } from "react";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuGroup,
} from "../ui/dropdown-menu";
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  UndoIcon,
  RedoIcon,
  MinusIcon,
  ListIcon,
  ListOrderedIcon,
  ChevronDown,
  TextIcon,
  ListChecksIcon,
} from "lucide-react";

interface DropdownMapping {
  [key: string]: (editor: any) => any;
}

const dropdown = [
  {
    label: "Paragraph",
    icon: <TextIcon size={16} />,
    action: (editor: any) => editor.chain().setParagraph().focus().run(),
  },
  {
    label: "Heading 1",
    icon: <Heading1Icon size={16} />,
    action: (editor: any) =>
      editor.chain().toggleHeading({ level: 1 }).focus().run(),
  },
  {
    label: "Heading 2",
    icon: <Heading2Icon size={16} />,
    action: (editor: any) =>
      editor.chain().toggleHeading({ level: 2 }).focus().run(),
  },
  {
    label: "Heading 3",
    icon: <Heading3Icon size={16} />,
    action: (editor: any) =>
      editor.chain().toggleHeading({ level: 3 }).focus().run(),
  },
];

const dropdownMapping: DropdownMapping = {
  Paragraph: (editor: any) => editor?.isActive("paragraph"),
  "Heading 1": (editor: any) => editor?.isActive("heading", { level: 1 }),
  "Heading 2": (editor: any) => editor?.isActive("heading", { level: 2 }),
  "Heading 3": (editor: any) => editor?.isActive("heading", { level: 3 }),
};

export const MenuBar = () => {
  const [selectedDropdown, setSelectedDropdown] = useState<string>(
    dropdown[0].label
  );
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  for (const item of dropdown) {
    if (
      dropdownMapping[item.label](editor) &&
      selectedDropdown !== item.label
    ) {
      setSelectedDropdown(item.label);
      break; // Exit the loop once the first matching case is found
    }
  }

  return (
    <div className="flex items-center gap-1 flex-wrap mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-2 h-auto">
            {
              dropdown.find((dropdown) => dropdown.label === selectedDropdown)
                ?.icon
            }
            <span className="ml-2">
              <ChevronDown size={16} />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
          <DropdownMenuGroup>
            {dropdown.map((item) => (
              <DropdownMenuItem
                key={item.label}
                onSelect={() => {
                  setSelectedDropdown(item.label);
                  item.action(editor);
                }}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        variant={editor.isActive("bold") ? "default" : "ghost"}
        className="p-2 h-auto"
      >
        <BoldIcon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        variant={editor.isActive("italic") ? "default" : "ghost"}
        className="p-2 h-auto"
      >
        <ItalicIcon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        variant={editor.isActive("strike") ? "default" : "ghost"}
        className="p-2 h-auto"
      >
        <StrikethroughIcon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        variant={editor.isActive("bulletList") ? "default" : "ghost"}
        className="p-2 h-auto"
      >
        <ListIcon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        variant={editor.isActive("orderedList") ? "default" : "ghost"}
        className="p-2 h-auto"
      >
        <ListOrderedIcon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        variant={editor.isActive("taskList") ? "default" : "ghost"}
        className="p-2 h-auto"
      >
        <ListChecksIcon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        variant="ghost"
        className="p-2 h-auto"
      >
        <MinusIcon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        variant="ghost"
        className="p-2 h-auto"
      >
        <UndoIcon size={16} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        variant="ghost"
        className="p-2 h-auto"
      >
        <RedoIcon size={16} />
      </Button>
      <Button
        onClick={() =>
          editor
            .chain()
            .insertContent(
              "<h1>Example Text</h1><p>Some text for the template.</p>"
            )
            .focus("end")
            .run()
        }
        variant="ghost"
        className="p-2 h-auto"
      >
        Template
      </Button>
    </div>
  );
};
