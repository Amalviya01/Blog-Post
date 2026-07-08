export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(import.meta.env.VITE_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Image upload failed");
  }

  const { url } = await response.json();
  return url;
}
