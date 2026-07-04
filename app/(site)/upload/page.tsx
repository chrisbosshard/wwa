"use client";

import dynamic from "next/dynamic";

const UploadProvider = dynamic(() => import("@/components/Upload/UploadProvider"), { ssr: false });

export default function UploadPage() {
  return <UploadProvider />;
}
