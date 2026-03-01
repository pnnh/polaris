export default async function () {

    return <>
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
                async
                crossOrigin="anonymous"
                defer={true}></script>
    </>
}
