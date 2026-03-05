import React from "react";
import {TocItem} from "@pnnh/atom";
import {Box, Tab, Tabs, Paper, IconButton, Tooltip, Stack, Chip} from "@mui/material";
import CodeIcon from '@mui/icons-material/Code';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`editor-tabpanel-${index}`}
            aria-labelledby={`editor-tab-${index}`}
            {...other}
            style={{ height: '100%' }}
        >
            {value === index && children}
        </div>
    );
}

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
        <Box className="flex flex-col h-full bg-white dark:bg-gray-900">
            {/* Editor Toolbar */}
            <Box className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Stack direction="row" justifyContent="space-between" alignItems="center" className="px-4 py-2">
                    <Tabs 
                        value={editorMode} 
                        onChange={(_, newValue) => setEditorMode(newValue)}
                        variant="standard"
                    >
                        <Tab 
                            icon={<CodeIcon />} 
                            label="Edit" 
                            iconPosition="start"
                            sx={{ minHeight: 48 }}
                        />
                        <Tab 
                            icon={<VisibilityIcon />} 
                            label="Preview" 
                            iconPosition="start"
                            sx={{ minHeight: 48 }}
                            disabled
                        />
                        <Tab 
                            icon={<SplitscreenIcon />} 
                            label="Split" 
                            iconPosition="start"
                            sx={{ minHeight: 48 }}
                            disabled
                        />
                    </Tabs>
                    
                    <Stack direction="row" spacing={1}>
                        <Chip 
                            label={`${wordCount} chars`} 
                            size="small" 
                            variant="outlined"
                        />
                        <Chip 
                            label={`${lineCount} lines`} 
                            size="small" 
                            variant="outlined"
                        />
                    </Stack>
                </Stack>
            </Box>

            {/* Editor Content */}
            <TabPanel value={editorMode} index={0}>
                <textarea 
                    className="w-full h-full p-6 font-mono text-sm resize-none border-0 focus:outline-none focus:ring-0 bg-white dark:bg-gray-900 dark:text-gray-100"
                    style={{ 
                        minHeight: 'calc(100vh - 400px)',
                        lineHeight: '1.6',
                    }}
                    value={bodyText}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="Start writing your note in Markdown..."
                    spellCheck={false}
                />
            </TabPanel>
            
            <TabPanel value={editorMode} index={1}>
                <Box className="p-6 h-full overflow-auto">
                    <div className="prose dark:prose-invert max-w-none">
                        {/* Preview will be here */}
                        <p className="text-gray-500 dark:text-gray-400">Preview mode coming soon...</p>
                    </div>
                </Box>
            </TabPanel>
            
            <TabPanel value={editorMode} index={2}>
                <Box className="flex h-full">
                    <Box className="flex-1 border-r border-gray-200 dark:border-gray-700">
                        <textarea 
                            className="w-full h-full p-6 font-mono text-sm resize-none border-0 focus:outline-none focus:ring-0"
                            value={bodyText}
                            onChange={(event) => onChange(event.target.value)}
                        />
                    </Box>
                    <Box className="flex-1 p-6 overflow-auto">
                        <div className="prose dark:prose-invert max-w-none">
                            {/* Split preview will be here */}
                            <p className="text-gray-500 dark:text-gray-400">Preview...</p>
                        </div>
                    </Box>
                </Box>
            </TabPanel>
        </Box>
    );
}
