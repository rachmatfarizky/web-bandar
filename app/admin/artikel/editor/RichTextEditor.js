"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, NodeViewWrapper, ReactNodeViewRenderer, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import {
  Bold,
  Italic,
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Minus,
  Plus,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading,
  Link2,
  ImagePlus,
  Maximize2,
  Minimize2
} from 'lucide-react';

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeToHtml(value) {
  if (!value) return '';
  const str = String(value);
  // If it already looks like HTML, keep it.
  if (/<\w+[\s\S]*?>/.test(str)) return str;
  // Legacy plain text -> simple HTML.
  const escaped = escapeHtml(str);
  const withBreaks = escaped.replaceAll('\n', '<br />');
  return `<p>${withBreaks}</p>`;
}

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'center',
        parseHTML: (element) => element.getAttribute('data-align') || null,
        renderHTML: (attributes) => {
          const align = attributes.align || 'center';
          return { 'data-align': align };
        }
      },
      width: {
        default: '100%',
        parseHTML: (element) => {
          const dataWidth = element.getAttribute('data-width');
          if (dataWidth) return dataWidth;
          const style = element.getAttribute('style') || '';
          const match = style.match(/width:\s*([^;]+);?/i);
          return match?.[1]?.trim() || null;
        },
        renderHTML: (attributes) => {
          const width = attributes.width || '100%';
          const align = attributes.align || 'center';

          let marginLeft = 'auto';
          let marginRight = 'auto';
          if (align === 'left') {
            marginLeft = '0';
            marginRight = 'auto';
          } else if (align === 'right') {
            marginLeft = 'auto';
            marginRight = '0';
          } else if (align === 'justify') {
            marginLeft = '0';
            marginRight = '0';
          }

          const computedWidth = align === 'justify' ? '100%' : width;
          return {
            'data-width': width,
            style: `display: block; width: ${computedWidth}; height: auto; max-width: 100%; margin-left: ${marginLeft}; margin-right: ${marginRight};`
          };
        }
      }
    };
  }
}).extend({
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNodeView);
  }
});

function ResizableImageNodeView(props) {
  const { editor, node, selected, updateAttributes, getPos } = props;
  const wrapperRef = useRef(null);
  const startRef = useRef({ x: 0, width: 0, maxWidth: 0, dragging: false, dragMode: null });

  const beginResize = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }

    const img = wrapperRef.current?.querySelector('img');
    const parent = wrapperRef.current?.parentElement;
    const currentWidth = img?.getBoundingClientRect().width || 300;
    const maxWidth = parent?.getBoundingClientRect().width || 900;

    startRef.current = {
      x: e.clientX,
      width: currentWidth,
      maxWidth,
      dragging: true,
      dragMode: 'resize'
    };

    const onMove = (ev) => {
      if (!startRef.current.dragging) return;
      const dx = ev.clientX - startRef.current.x;
      const next = Math.max(80, Math.min(startRef.current.maxWidth, startRef.current.width + dx * direction));
      updateAttributes({ width: `${Math.round(next)}px` });
    };

    const onUp = () => {
      startRef.current.dragging = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const beginDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }

    const wrapper = wrapperRef.current;
    const parent = wrapper?.parentElement;
    const rect = wrapper?.getBoundingClientRect();
    const parentRect = parent?.getBoundingClientRect();

    startRef.current = {
      x: e.clientX,
      y: e.clientY,
      wrapperX: rect?.left || 0,
      wrapperY: rect?.top || 0,
      parentX: parentRect?.left || 0,
      parentY: parentRect?.top || 0,
      dragging: true,
      dragMode: 'move'
    };

    const onMove = (ev) => {
      if (!startRef.current.dragging || startRef.current.dragMode !== 'move') return;
      
      const dx = ev.clientX - startRef.current.x;
      const dy = ev.clientY - startRef.current.y;
      
      const newX = startRef.current.wrapperX - startRef.current.parentX + dx;
      const newY = startRef.current.wrapperY - startRef.current.parentY + dy;
      
      wrapper.style.position = 'relative';
      wrapper.style.left = `${newX}px`;
      wrapper.style.top = `${newY}px`;
      wrapper.style.cursor = 'grabbing';
    };

    const onUp = () => {
      startRef.current.dragging = false;
      wrapper.style.cursor = 'grab';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <NodeViewWrapper as="div" ref={wrapperRef} className="relative w-full" draggable={false}>
      <div style={{
        display: 'flex',
        justifyContent: node.attrs.align === 'left' ? 'flex-start' : 
                       node.attrs.align === 'right' ? 'flex-end' : 
                       node.attrs.align === 'justify' ? 'stretch' : 'center',
        width: '100%',
        marginBottom: '1rem'
      }}>
        <div style={{
          position: 'relative',
          display: 'inline-block',
          maxWidth: node.attrs.align === 'justify' ? '100%' : 'auto',
          width: node.attrs.align === 'justify' ? '100%' : 'auto'
        }}>
          <img
            src={node.attrs.src}
            alt={node.attrs.alt || ''}
            title={node.attrs.title || ''}
            style={{
              display: 'block',
              width: node.attrs.align === 'justify' ? '100%' : (node.attrs.width || '100%'),
              height: 'auto',
              maxWidth: '100%',
              borderRadius: '0.5rem'
            }}
            data-width={node.attrs.width || '100%'}
            data-align={node.attrs.align || 'center'}
            className="block rounded-lg"
            onClick={() => {
              if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos());
            }}
            draggable={false}
          />

          {selected && (
            <>
              <span className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-emerald-300" />
              {/* helper grid */}
              <span className="pointer-events-none absolute inset-0 rounded-lg" aria-hidden>
                <span className="absolute left-1/2 top-0 -translate-x-1/2 h-full border-l border-dashed border-slate-200" />
                <span className="absolute top-1/2 left-0 -translate-y-1/2 w-full border-t border-dashed border-slate-200" />
              </span>

              {/* move handle */}
              <button
                type="button"
                onMouseDown={beginDrag}
                className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded border border-slate-300 bg-emerald-500 text-white shadow-sm cursor-grab hover:bg-emerald-600 text-xs font-semibold"
                title="Drag untuk memindahkan gambar"
              >
                ⇄ Pindahkan
              </button>

              {/* resize handles */}
              <button
                type="button"
                onMouseDown={(e) => beginResize(e, -1)}
                className="absolute -top-2 -left-2 h-5 w-5 rounded border border-slate-300 bg-white shadow-sm cursor-nwse-resize"
                title="Drag untuk resize"
              />
              <button
                type="button"
                onMouseDown={(e) => beginResize(e, 1)}
                className="absolute -top-2 -right-2 h-5 w-5 rounded border border-slate-300 bg-white shadow-sm cursor-nesw-resize"
                title="Drag untuk resize"
              />
              <button
                type="button"
                onMouseDown={(e) => beginResize(e, -1)}
                className="absolute -bottom-2 -left-2 h-5 w-5 rounded border border-slate-300 bg-white shadow-sm cursor-nesw-resize"
                title="Drag untuk resize"
              />
              <button
                type="button"
                onMouseDown={(e) => beginResize(e, 1)}
                className="absolute -bottom-2 -right-2 h-5 w-5 rounded border border-slate-300 bg-white shadow-sm cursor-nwse-resize"
                title="Drag untuk resize"
              />
            </>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
}

function ToolbarButton({ onClick, active, title, disabled, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={
        "h-9 w-9 inline-flex items-center justify-center rounded-lg border text-slate-700 transition " +
        (disabled ? "opacity-50 cursor-not-allowed " : "hover:bg-slate-50 ") +
        (active ? "bg-slate-100 border-slate-300" : "bg-white border-slate-200")
      }
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, placeholder = 'Mulai tulis cerita Anda...' }) {
  const [expanded, setExpanded] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);

  const initialContent = useMemo(() => normalizeToHtml(value), []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: 'noopener noreferrer nofollow',
          target: '_blank'
        }
      }),
      ResizableImage.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[360px] outline-none px-4 py-4 text-slate-700 leading-relaxed " +
          (expanded ? "min-h-[70vh]" : "")
      }
    }
  });

  // Keep editor in sync when parent value changes (e.g. load edit data)
  useEffect(() => {
    if (!editor) return;
    const normalized = normalizeToHtml(value);
    if (normalized && editor.getHTML() !== normalized) {
      editor.commands.setContent(normalized, false);
    }
    if (!normalized && editor.getText().trim()) {
      editor.commands.clearContent(true);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
        <div className="border-b border-slate-100 px-4 py-3 text-slate-500 text-sm">Memuat editor...</div>
        <div className="p-6 text-slate-400">&nbsp;</div>
      </div>
    );
  }

  const askLink = () => {
    const currentHref = editor.getAttributes('link').href;
    const url = window.prompt('Masukkan URL', currentHref || 'https://');
    if (url === null) return;
    const trimmed = url.trim();
    if (!trimmed) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: trimmed }).run();
  };

  const askImage = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handlePickImage = async (e) => {
    const file = e.target.files?.[0];
    // reset so selecting same file again triggers onChange
    e.target.value = '';
    if (!file) return;

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!data?.url) throw new Error(data?.error || 'Upload gagal');
      editor.chain().focus().setImage({ src: data.url, width: '100%' }).run();
    } catch (err) {
      window.alert('Gagal upload gambar: ' + (err?.message || String(err)));
    } finally {
      setImageUploading(false);
    }
  };

  const isImageSelected = editor.isActive('image');
  const imageAttrs = isImageSelected ? editor.getAttributes('image') : {};
  const imageAlign = imageAttrs?.align || 'center';

  const setImageAlign = (align) => {
    if (!editor.isActive('image')) return;
    const updateData = { align };
    if (align === 'justify') updateData.width = '100%';
    editor.chain().focus().updateAttributes('image', updateData).run();
  };
  const resizeImageBy = (deltaPercent) => {
    if (!isImageSelected) return;
    const current = editor.getAttributes('image')?.width || '100%';
    const isPx = String(current).includes('px');
    const base = parseInt(String(current).replace('%', '').replace('px', ''), 10);
    const safeBase = Number.isFinite(base) ? base : isPx ? 480 : 100;

    if (isPx) {
      const next = Math.max(120, safeBase + deltaPercent * 24);
      editor.chain().focus().updateAttributes('image', { width: `${next}px` }).run();
      return;
    }

    const next = Math.max(10, Math.min(100, safeBase + deltaPercent));
    editor.chain().focus().updateAttributes('image', { width: `${next}%` }).run();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePickImage}
      />
      <div className="flex flex-wrap items-center gap-2 px-3 py-3 border-b border-slate-100 bg-white">
        <ToolbarButton
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <ToolbarButton
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Ordered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <ToolbarButton
          title="Heading"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          <Heading className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <ToolbarButton
          title="Align left"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Align center"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Align right"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Justify"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          active={editor.isActive({ textAlign: 'justify' })}
        >
          <AlignJustify className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <ToolbarButton
          title="Link"
          onClick={askLink}
          active={editor.isActive('link')}
        >
          <Link2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Image" onClick={askImage} active={false}>
          <ImagePlus className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Kecilkan gambar"
          onClick={() => resizeImageBy(-10)}
          active={false}
          disabled={!isImageSelected}
        >
          <Minus className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Besarkan gambar"
          onClick={() => resizeImageBy(10)}
          active={false}
          disabled={!isImageSelected}
        >
          <Plus className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Gambar rata kiri"
          onClick={() => setImageAlign('left')}
          active={isImageSelected && imageAlign === 'left'}
          disabled={!isImageSelected}
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Gambar rata tengah"
          onClick={() => setImageAlign('center')}
          active={isImageSelected && imageAlign === 'center'}
          disabled={!isImageSelected}
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Gambar rata kanan"
          onClick={() => setImageAlign('right')}
          active={isImageSelected && imageAlign === 'right'}
          disabled={!isImageSelected}
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Gambar justify (full width)"
          onClick={() => setImageAlign('justify')}
          active={isImageSelected && imageAlign === 'justify'}
          disabled={!isImageSelected}
        >
          <AlignJustify className="w-4 h-4" />
        </ToolbarButton>

        <div className="flex-1" />

        <ToolbarButton
          title={expanded ? 'Kecilkan editor' : 'Perbesar editor'}
          onClick={() => setExpanded(v => !v)}
          active={expanded}
        >
          {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </ToolbarButton>
      </div>

      {imageUploading && (
        <div className="px-4 py-2 text-xs text-emerald-700 bg-emerald-50 border-b border-emerald-100">
          Mengupload gambar...
        </div>
      )}

      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
