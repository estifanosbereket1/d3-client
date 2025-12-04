"use client";

import { useCallback, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Camera, X } from "lucide-react";
import { on } from "events";

interface AvatarUploaderProps {
    onUploadSuccess: (url: string) => void;
    imageUrl?: string;
}

export function LogoUploader({ onUploadSuccess, imageUrl }: AvatarUploaderProps) {
    // clear image (user pressed cancel)
    const handleRemove = useCallback(() => {
        imageUrl = "";
    }, [onUploadSuccess, imageUrl]);

    useEffect(() => {
        console.log(imageUrl, onUploadSuccess)
    }, [imageUrl, onUploadSuccess])

    return (
        <CldUploadWidget
            key={"no-image"}
            uploadPreset="d3-client"
            signatureEndpoint="/api/sign-cloudinary-params"
            onSuccess={(result) => {
                if (typeof result.info === "object" && "secure_url" in result.info) {
                    onUploadSuccess(result.info.secure_url);
                }
            }}
            onOpen={(CldUploadEventCallbackWidgetOnly) => {
                console.log("cloudinary widget opened", CldUploadEventCallbackWidgetOnly);
            }}
            // onSuccess={(result) => {
            //     console.log("cloudinary success", result);
            //     const secure =
            //         result?.info?.secure_url ?? result?.info?.url ?? (typeof result.info === "string" ? result.info : null);
            //     if (secure) {
            //         onUploadSuccess(secure);
            //     } else {
            //         console.warn("unexpected upload result shape", result);
            //     }
            // }}
            onError={(err) => {
                console.error("cloudinary error", err);
                alert("Failed to upload — check console for details.");
            }}
            options={{
                singleUploadAutoClose: true,
                maxFiles: 4
            }}

        >
            {({ open }) => (
                <div className="relative w-24 h-24">
                    <div
                        className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-indigo-500 transition"
                        onClick={() => {
                            open?.();
                        }}
                        aria-label={imageUrl ? "Edit logo" : "Upload logo"}
                    >
                        {imageUrl ? (
                            <img src={imageUrl} alt="Organization Logo" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-500 font-medium">Logo</span>
                        )}
                    </div>



                    {!imageUrl && (
                        <div
                            className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-md cursor-pointer hover:bg-indigo-500 transition"
                            onClick={() => open?.()}
                            title="Upload logo"
                            aria-label="Upload logo"
                        >
                            <Camera className="w-4 h-4" />
                        </div>
                    )}
                </div>
            )}
        </CldUploadWidget>
    );
}

