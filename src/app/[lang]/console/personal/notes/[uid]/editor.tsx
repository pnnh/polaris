import React from "react";
import { TocItem } from "@pnnh/atom";
import { Code, Eye, Columns2 } from 'lucide-react';

export function ConsoleArticleEditor({
    tocList, header, body, assetsUrl, onChange
}: {
    tocList: Array<TocItem>,
    header: string,
    body: unknown,
    assetsUrl: string,
    onChange: (body: string) => void
}) {
    const [editorMode, setEditorMode] = React.useState(0);
    const bodyText = body as string || '';
    const wordCount = bodyText.length;
    const lineCount = bodyText.split('\\n').length;

    return (
        <div className="flex flex-col h-full">
            {/* Editor Toolbar */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center" role="tablist">
                        <button
                            role="tab"
                            aria-selected={editorMode === 0}
                            onClick={() => setEditorMode(0)}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md transition-colors
                                ${editorMode === 0 ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Code size={16} />Edit
                        </button>
                        <button
                            role="tab"
                            aria-selected={editorMode === 1}
                            onClick={() => setEditorMode(1)}
                            disabled
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md text-muted-foreground opacity-50 cursor-not-allowed"
                        >
                            <Eye size={16} />Preview
                        </button>
                        <button
                            role="tab"
                            aria-selected={editorMode === 2}
                            onClick={() => setEditorMode(2)}
                            disabled
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md text-muted-foreground opacity-50 cursor-not-allowed"
                        >
                            <Columns2 size={16} />Split
                        </button>
                    </div>

                    <div className="flex items-center gap-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full border text-xs">
                            {wordCount} chars
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full border text-xs">
                            {lineCount} lines
                        </span>
                    </div>
                </div>
            </div>

            {/* Editor Content */}
            <div role="tabpanel" hidden={editorMode !== 0} style={{ height: '100%' }}>
                {editorMode === 0 && (
                    <textarea
                        className="w-full h-full p-6 font-mono text-sm resize-none border-0 focus:outline-none focus:ring-0 bg-white dark:bg-gray-900 dark:text-gray-100"
                        style={{ minHeight: 'calc(100vh - 400px)', lineHeight: '1.6' }}
                        value={bodyText}
                        onChange={(event) => onChange(event.target.value)}
                        placeholder="Start writing your note in Markdown..."
                        spellCheck={false}
                    />
                )}
            </div>

            <div role="tabpanel" hidden={editorMode !== 1} style={{ height: '100%' }}>
                {editorMode === 1 && (
                    <div className="p-6 h-full overflow-auto">
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-gray-500 dark:text-gray-400">Preview mode coming soon...</p>
                        </div>
                    </div>
                )}
            </div>

            <div role="tabpanel" hidden={editorMode !== 2} style={{ height: '100%' }}>
                {editorMode === 2 && (
                    <div className="flex h-full">
                        <div className="flex-1 border-r border-gray-200 dark:border-gray-700">
                            <textarea
                                className="w-full h-full p-6 font-mono text-sm resize-none border-0 focus:outline-none focus:ring-0"
                                value={bodyText}
                                onChange={(event) => onChange(event.target.value)}
                            />
                        </div>
                        <div className="flex-1 p-6 overflow-auto">
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-gray-500 dark:text-gray-400">Preview...</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
