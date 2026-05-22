export async function uploadImage(file: File): Promise<{
  url: string;
  publicId: string;
}> {
  const cloudName   = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // Debug — remove after fixing
  console.log("Cloud name:", cloudName);
  console.log("Upload preset:", uploadPreset);

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary env variables are missing");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json();
    console.error("Cloudinary error:", err);
    throw new Error(err.error?.message ?? "Image upload failed");
  }

  const data = await res.json();
  return {
    url:      data.secure_url,
    publicId: data.public_id,
  };
}

export function getOptimizedUrl(url: string, width = 400): string {
  return url.replace("/upload/", `/upload/w_${width},q_auto,f_auto/`);
}