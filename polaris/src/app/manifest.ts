import {MetadataRoute} from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Huable",
        short_name: "Huable",
        description: "Huable",
        id: "xyz.huable",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        orientation: "any",
        icons: [
            {
                src: "/pwa/icons/web-app-manifest-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "/pwa/icons/web-app-manifest-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any"
            }
        ],
        screenshots: [
            {
                "src": "/pwa/screenshots/desktop/home.jpg",
                "sizes": "1280x720",
                "type": "image/jpeg",
                "form_factor": "wide",
                "label": "Home screen showing main navigation and featured content"
            },
            {
                "src": "/pwa/screenshots/mobile/home.jpg",
                "sizes": "640x960",
                "type": "image/jpeg",
                "form_factor": "narrow",
                "label": "Home screen showing main navigation and featured content"
            }
        ]
    }
}
