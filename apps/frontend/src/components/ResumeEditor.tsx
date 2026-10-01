'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface Props {
  initialContent: string;
  onChange: (html: string) => void;
}

export default function ResumeEditor({ initialContent, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] border border-gray-200 p-6 rounded-b-md text-gray-800',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 w-full max-w-4xl">
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-2 rounded-t-md">
        <button 
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 text-sm font-semibold border rounded transition ${editor.isActive('bold') ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
        >
          Bold
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 text-sm font-semibold border rounded transition ${editor.isActive('italic') ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
        >
          Italic
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 text-sm font-semibold border rounded transition ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
        >
          Heading 2
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 text-sm font-semibold border rounded transition ${editor.isActive('bulletList') ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
        >
          Bullet List
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
