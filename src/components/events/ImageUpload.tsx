"use client";

import { useState } from "react";
// Using regular HTML elements with Tailwind CSS
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface EventImage {
  id: string;
  url: string;
  altText?: string;
  caption?: string;
  order: number;
  width?: number;
  height?: number;
  createdAt: string;
}

interface ImageUploadProps {
  eventId: string;
  images: EventImage[];
  onImagesChange: (images: EventImage[]) => void;
  isOwner: boolean;
}

export default function ImageUpload({
  eventId,
  images,
  onImagesChange,
  isOwner,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ altText: "", caption: "" });

  // Generate random placehold.co image
  const generateRandomImage = () => {
    const widths = [800, 900, 1000, 1200];
    const heights = [400, 500, 600, 700];
    const colors = [
      "FF6B6B",
      "4ECDC4",
      "45B7D1",
      "FFA07A",
      "98D8C8",
      "F7DC6F",
      "BB8FCE",
      "85C1E9",
    ];
    const texts = [
      "Event+Photo",
      "Beautiful+Moment",
      "Great+Times",
      "Memories",
      "Fun+Event",
      "Amazing+Day",
      "Special+Moment",
      "Good+Vibes",
    ];

    const width = widths[Math.floor(Math.random() * widths.length)];
    const height = heights[Math.floor(Math.random() * heights.length)];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];
    const textColor = "FFFFFF";
    const text = texts[Math.floor(Math.random() * texts.length)];

    return {
      url: `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${text}`,
      width,
      height,
    };
  };

  const handleAddImage = async () => {
    if (!isOwner) return;

    // In development, use random images. In production, this would trigger file upload
    if (process.env.NODE_ENV === "development") {
      setIsUploading(true);
      try {
        const { url, width, height } = generateRandomImage();

        const response = await fetch(`/api/events/${eventId}/images`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            width,
            height,
            altText: "Event image",
            caption: "",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add image");
        }

        const { image } = await response.json();
        onImagesChange([...images, image]);
      } catch (error) {
        console.error("Error adding image:", error);
        alert("Failed to add image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    } else {
      // Production: Trigger file upload (to be implemented)
      alert("File upload functionality will be implemented for production");
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!isOwner) return;

    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}/images/${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      onImagesChange(images.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handleEditImage = (image: EventImage) => {
    setEditingImage(image.id);
    setEditForm({
      altText: image.altText || "",
      caption: image.caption || "",
    });
  };

  const handleSaveEdit = async (imageId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/images/${imageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error("Failed to update image");
      }

      const { image } = await response.json();
      onImagesChange(images.map((img) => (img.id === imageId ? image : img)));
      setEditingImage(null);
    } catch (error) {
      console.error("Error updating image:", error);
      alert("Failed to update image. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingImage(null);
    setEditForm({ altText: "", caption: "" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Event Images</h3>
        {isOwner && (
          <button
            onClick={handleAddImage}
            disabled={isUploading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Add Image
              </>
            )}
          </button>
        )}
      </div>

      {images.length === 0 ? (
        <div className="border border-gray-200 rounded-lg">
          <div className="flex flex-col items-center justify-center py-12 text-center p-6">
            <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No images added yet</p>
            {isOwner && (
              <button
                onClick={handleAddImage}
                disabled={isUploading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Add Image
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={image.url}
                  alt={image.altText || "Event image"}
                  className="w-full h-48 object-cover"
                />
                {isOwner && (
                  <button
                    className="absolute top-2 right-2 p-1 h-8 w-8 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="p-4">
                {editingImage === image.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Alt text"
                      value={editForm.altText}
                      onChange={(e) =>
                        setEditForm({ ...editForm, altText: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Caption"
                      value={editForm.caption}
                      onChange={(e) =>
                        setEditForm({ ...editForm, caption: e.target.value })
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(image.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {image.altText && (
                      <p className="text-sm font-medium">{image.altText}</p>
                    )}
                    {image.caption && (
                      <p className="text-sm text-gray-600">{image.caption}</p>
                    )}
                    {isOwner && (
                      <button
                        onClick={() => handleEditImage(image)}
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
                      >
                        Edit Details
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
