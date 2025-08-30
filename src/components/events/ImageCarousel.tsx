"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
// Using regular HTML elements with Tailwind CSS

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

interface ImageCarouselProps {
  images: EventImage[];
  className?: string;
}

export default function ImageCarousel({
  images,
  className = "",
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Sort images by order
  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (currentIndex >= sortedImages.length) {
      setCurrentIndex(0);
    }
  }, [sortedImages.length, currentIndex]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + sortedImages.length) % sortedImages.length
    );
  };

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % sortedImages.length);
  };

  const prevModalImage = () => {
    setModalImageIndex(
      (prev) => (prev - 1 + sortedImages.length) % sortedImages.length
    );
  };

  // Handle keyboard navigation in modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;

      if (e.key === "ArrowLeft") {
        prevModalImage();
      } else if (e.key === "ArrowRight") {
        nextModalImage();
      } else if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  if (sortedImages.length === 0) {
    return null;
  }

  const currentImage = sortedImages[currentIndex];
  const modalImage = sortedImages[modalImageIndex];

  return (
    <>
      <div className={`relative ${className}`}>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="relative">
            <img
              src={currentImage.url}
              alt={currentImage.altText || "Event image"}
              className="w-full h-64 md:h-80 lg:h-96 object-cover cursor-pointer"
              onClick={() => openModal(currentIndex)}
            />

            {/* Zoom indicator */}
            <button
              className="absolute top-2 right-2 p-2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded"
              onClick={() => openModal(currentIndex)}
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Navigation arrows */}
            {sortedImages.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 h-10 w-10 bg-black/50 hover:bg-black/70 text-white rounded"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 h-10 w-10 bg-black/50 hover:bg-black/70 text-white rounded"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image counter */}
            {sortedImages.length > 1 && (
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {currentIndex + 1} / {sortedImages.length}
              </div>
            )}
          </div>

          {/* Image details */}
          {(currentImage.altText || currentImage.caption) && (
            <div className="p-4">
              {currentImage.altText && (
                <h4 className="font-medium mb-1">{currentImage.altText}</h4>
              )}
              {currentImage.caption && (
                <p className="text-sm text-gray-600">{currentImage.caption}</p>
              )}
            </div>
          )}
        </div>

        {/* Thumbnail navigation */}
        {sortedImages.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {sortedImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentIndex
                    ? "border-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 p-2 h-10 w-10 rounded"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation arrows */}
            {sortedImages.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-2 h-12 w-12 z-10 rounded"
                  onClick={prevModalImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-2 h-12 w-12 z-10 rounded"
                  onClick={nextModalImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image counter */}
            {sortedImages.length > 1 && (
              <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded text-sm z-10">
                {modalImageIndex + 1} / {sortedImages.length}
              </div>
            )}

            {/* Main image */}
            <img
              src={modalImage.url}
              alt={modalImage.altText || "Event image"}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image details overlay */}
            {(modalImage.altText || modalImage.caption) && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded z-10">
                {modalImage.altText && (
                  <h4 className="font-medium mb-1">{modalImage.altText}</h4>
                )}
                {modalImage.caption && (
                  <p className="text-sm opacity-90">{modalImage.caption}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
