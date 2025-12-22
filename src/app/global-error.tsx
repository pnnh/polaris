export default function GlobalError({error}: { error: Error & { digest?: string } }) {

    return (
        <html>
        <body>
        {error ? error.name + ": " + error.message : 'Unknown Error'}
        </body>
        </html>
    );
}
