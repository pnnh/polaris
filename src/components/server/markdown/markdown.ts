import {marked} from "marked";
import DOMPurify from 'dompurify';

export function markdownStringToHtml(markText: string) {
    const rawHtml = marked.parse(markText) as string;
    // use DOMPurify to sanitize the HTML to prevent XSS attacks
    return DOMPurify.sanitize(rawHtml);
}