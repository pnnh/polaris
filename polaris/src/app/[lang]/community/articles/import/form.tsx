'use client'

import React from "react";
import {transKey} from "@/components/common/locales/normal";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {PSFileModel} from "@/components/common/models/file";
import {PSChannelModel} from "@/components/common/models/channel";
import {CommunityBrowser} from "@/components/community/browser";
import {EmptyUUID, formatRfc3339, STSubString} from "@pnnh/atom";

function InlineCheckbox({checked, indeterminate, onChange, onClick, disabled}: {
    checked: boolean; indeterminate?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}) {
    const ref = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
        if (ref.current) ref.current.indeterminate = !!indeterminate;
    }, [indeterminate]);
    return <input type="checkbox" ref={ref} checked={checked} onChange={onChange}
                  onClick={onClick} disabled={disabled} className="w-4 h-4 cursor-pointer"/>;
}

export function ImportArticlesForm({stargateUrl, notesString, channelsString, keyword, lang}: {
    stargateUrl: string,
    notesString: string,
    channelsString: string,
    keyword: string,
    lang: string
}) {
    const notes = JSON.parse(notesString) as PSFileModel[];
    const channels = JSON.parse(channelsString) as PSChannelModel[];

    const [selectedChannel, setSelectedChannel] = React.useState('');
    const [selectedNotes, setSelectedNotes] = React.useState<Set<string>>(new Set());
    const [searchText, setSearchText] = React.useState(keyword || '');
    const [importing, setImporting] = React.useState(false);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedNotes(new Set(notes.map(note => note.uid)));
        } else {
            setSelectedNotes(new Set());
        }
    };

    const handleSelectNote = (noteUid: string) => {
        const newSelected = new Set(selectedNotes);
        if (newSelected.has(noteUid)) {
            newSelected.delete(noteUid);
        } else {
            newSelected.add(noteUid);
        }
        setSelectedNotes(newSelected);
    };

    const handleSearch = () => {
        const url = new URL(window.location.href);
        if (searchText) {
            url.searchParams.set('keyword', searchText);
        } else {
            url.searchParams.delete('keyword');
        }
        window.location.href = url.pathname + url.search;
    };

    const handleImport = async () => {
        if (!selectedChannel) {
            alert(transKey(lang, "console.article.selectChannelFirst"));
            return;
        }
        if (selectedNotes.size === 0) {
            alert(transKey(lang, "console.article.selectNotesFirst"));
            return;
        }

        setImporting(true);

        try {
            const selectedNotesList = notes.filter(note => selectedNotes.has(note.uid));
            let successCount = 0;
            let failCount = 0;

            for (const note of selectedNotesList) {
                const articleModel = {
                    uid: EmptyUUID,
                    title: note.title,
                    description: note.description,
                    body: note.body,
                    cover: note.cover,
                    header: note.header,
                    lang: note.lang,
                    channel: selectedChannel,
                    keywords: note.keywords,
                    name: note.name
                };

                const articleId = await CommunityBrowser.clientConsoleInsertArticle(stargateUrl, articleModel);
                if (articleId) {
                    successCount++;
                } else {
                    failCount++;
                }
            }

            alert(transKey(lang, "console.article.importResult")
                .replace('{success}', successCount.toString())
                .replace('{fail}', failCount.toString()));

            if (successCount > 0) {
                window.location.href = `/${lang}/community/articles`;
            }
        } catch (error) {
            console.error('Import failed:', error);
            alert(transKey(lang, "console.article.importFailed"));
        } finally {
            setImporting(false);
        }
    };

    const allSelected = notes.length > 0 && selectedNotes.size === notes.length;
    const someSelected = selectedNotes.size > 0 && selectedNotes.size < notes.length;

    return (
        <div>
            <h4 className="text-xl font-semibold mb-4">
                {transKey(lang, "console.article.importFromNotes")}
            </h4>

            {/* Toolbar */}
            <div className="rounded-lg border shadow-sm p-3 mb-4 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex flex-1 items-center gap-2">
                    <span className="text-sm min-w-[100px]">{transKey(lang, "console.article.selectChannel")}:</span>
                    <select
                        value={selectedChannel}
                        onChange={(event) => setSelectedChannel(event.target.value)}
                        className="h-8 rounded border px-2 text-sm min-w-[300px] flex-1"
                    >
                        <option value="" disabled>
                            {transKey(lang, "console.article.pleaseSelectChannel")}
                        </option>
                        {channels.map(channel => (
                            <option key={channel.uid} value={channel.uid}>{channel.name}</option>
                        ))}
                    </select>
                </div>
                <Button onClick={handleImport}
                        disabled={!selectedChannel || selectedNotes.size === 0 || importing}>
                    {importing
                        ? transKey(lang, 'console.article.importing')
                        : transKey(lang, 'console.article.confirmImport')}
                    {selectedNotes.size > 0 && ` (${selectedNotes.size})`}
                </Button>
            </div>

            {/* Search Box */}
            <div className="rounded-lg border shadow-sm p-3 mb-3 flex gap-2 items-center">
                <Input
                    placeholder={transKey(lang, "searchPlaceholder")}
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') handleSearch();
                    }}
                />
                <Button onClick={handleSearch}>{transKey(lang, "common.search")}</Button>
            </div>

            {/* Info Alert */}
            {selectedNotes.size > 0 && (
                <Alert className="mb-3">
                    <AlertDescription>
                        {transKey(lang, "console.article.selectedCount")
                            .replace('{count}', selectedNotes.size.toString())}
                    </AlertDescription>
                </Alert>
            )}

            {/* Notes List */}
            <div className="rounded-lg border shadow-sm">
                <table className="w-full text-sm border-collapse">
                    <thead>
                    <tr>
                        <th className="w-10 p-2 border-b text-left">
                            <InlineCheckbox indeterminate={someSelected} checked={allSelected}
                                            onChange={handleSelectAll}/>
                        </th>
                        <th className="p-2 border-b text-left font-semibold">{transKey(lang, "console.note.title")}</th>
                        <th className="p-2 border-b text-left font-semibold">{transKey(lang, "console.note.body")}</th>
                        <th className="p-2 border-b text-left font-semibold">{transKey(lang, "console.note.language")}</th>
                        <th className="p-2 border-b text-left font-semibold">{transKey(lang, "console.note.updateTime")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {notes.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                {transKey(lang, "console.note.noData")}
                            </td>
                        </tr>
                    ) : (
                        notes.map((note) => (
                            <tr key={note.uid}
                                data-selected={selectedNotes.has(note.uid) || undefined}
                                onClick={() => handleSelectNote(note.uid)}
                                className="hover:bg-muted/50 data-[selected]:bg-muted border-b cursor-pointer">
                                <td className="w-10 p-2">
                                    <InlineCheckbox checked={selectedNotes.has(note.uid)}
                                                    onChange={() => handleSelectNote(note.uid)}/>
                                </td>
                                <td className="p-2 font-medium">{note.title || transKey(lang, "console.note.untitled")}</td>
                                <td className="p-2 text-muted-foreground truncate max-w-[300px]">
                                    {STSubString(note.body || note.description || '', 100)}
                                </td>
                                <td className="p-2">{note.lang.toUpperCase()}</td>
                                <td className="p-2 text-muted-foreground text-xs">{formatRfc3339(note.update_time)}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {notes.length >= 50 && (
                <Alert className="mt-3">
                    <AlertDescription>{transKey(lang, "console.article.maxNotesShown")}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}
