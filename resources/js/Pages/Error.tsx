import React from "react";
import { Head, Link } from "@inertiajs/react";

interface Props {
    status: number;
}

export default function Error({ status }: Props) {
    const title =
        {
            503: "503: Service Unavailable",
            500: "500: Server Error",
            404: "404: Page Not Found",
            403: "403: Forbidden",
            429: "429: Too Many Requests",
        }[status] || "An Error Occurred";

    const description =
        {
            503: "Sorry, we are doing some maintenance. Please check back soon.",
            500: "Whoops, something went wrong on our servers.",
            404: "Sorry, the page you are looking for could not be found.",
            403: "Sorry, you are forbidden from accessing this page.",
            429: "You have sent too many requests in a short time. Please slow down and wait a minute.",
        }[status] || "An unexpected error occurred.";

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
            <Head title={title} />
            <div className="max-w-md w-full text-center bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                    {status}
                </h1>
                <p className="text-slate-600 mb-6">{description}</p>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
