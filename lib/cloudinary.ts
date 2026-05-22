export async function uploadImage(file: File): Promise<{
  url: string;
  publicId: string;
}> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Image upload failed");

  const data = await res.json();
  return {
    url:      data.secure_url,
    publicId: data.public_id,
  };
}

export function getOptimizedUrl(url: string, width = 400): string {
  // Inject Cloudinary transformations into the URL
  return url.replace("/upload/", `/upload/w_${width},q_auto,f_auto/`);
}