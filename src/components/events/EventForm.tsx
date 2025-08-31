"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import ImageUpload from "./ImageUpload";
import GooglePlacesAutocomplete from "./GooglePlacesAutocomplete";
import GoogleMapPreview from "./GoogleMapPreview";

interface Category {
  id: string;
  name: string;
  color: string | null;
}

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

interface EventFormProps {
  eventId?: string; // If provided, we're editing
  initialData?: {
    title: string;
    description: string | null;
    location: string | null;
    locationName: string | null;
    locationAddress: string | null;
    locationLat: number | null;
    locationLng: number | null;
    locationPlaceId: string | null;
    startDate: string;
    endDate: string | null;
    maxCapacity: number | null;
    isPublic: boolean;
    categories: Array<{ category: { id: string; name: string } }>;
  };
}

export function EventForm({ eventId, initialData }: EventFormProps) {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<EventImage[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    locationName: initialData?.locationName || "",
    locationAddress: initialData?.locationAddress || "",
    locationLat: initialData?.locationLat || null,
    locationLng: initialData?.locationLng || null,
    locationPlaceId: initialData?.locationPlaceId || "",
    startDate: initialData?.startDate
      ? new Date(initialData.startDate).toISOString().slice(0, 16)
      : "",
    endDate: initialData?.endDate
      ? new Date(initialData.endDate).toISOString().slice(0, 16)
      : "",
    maxCapacity: initialData?.maxCapacity?.toString() || "",
    isPublic: initialData?.isPublic ?? true,
    categoryIds: initialData?.categories.map((c) => c.category.id) || [],
    tagNames: [] as string[],
  });

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle place selection from Google Places Autocomplete
  const handlePlaceSelect = (place: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    placeId: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      locationName: place.name,
      locationAddress: place.address,
      locationLat: place.lat,
      locationLng: place.lng,
      locationPlaceId: place.placeId,
      location: place.address, // Keep legacy field for backward compatibility
    }));
  };

  useEffect(() => {
    fetchCategories();
    if (eventId) {
      fetchImages();
    }
  }, [eventId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/events/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error(t("messages.failedToFetchCategories"), error);
    }
  };

  const fetchImages = async () => {
    if (!eventId) return;

    try {
      const response = await fetch(`/api/events/${eventId}/images`);
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t("forms.validation.titleRequired");
    }

    if (!formData.startDate) {
      newErrors.startDate = t("forms.validation.startDateRequired");
    }

    if (
      formData.endDate &&
      formData.startDate &&
      new Date(formData.endDate) <= new Date(formData.startDate)
    ) {
      newErrors.endDate = t("forms.validation.endDateAfterStart");
    }

    if (formData.maxCapacity && parseInt(formData.maxCapacity) < 1) {
      newErrors.maxCapacity = t("forms.validation.capacityMinimum");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        location: formData.location.trim() || null,
        locationName: formData.locationName?.trim() || null,
        locationAddress: formData.locationAddress?.trim() || null,
        locationLat: formData.locationLat,
        locationLng: formData.locationLng,
        locationPlaceId: formData.locationPlaceId?.trim() || null,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        maxCapacity: formData.maxCapacity
          ? parseInt(formData.maxCapacity)
          : null,
        isPublic: formData.isPublic,
        categoryIds: formData.categoryIds,
        tagNames: formData.tagNames.filter((tag) => tag.trim()),
      };

      const url = eventId ? `/api/events/${eventId}` : "/api/events";
      const method = eventId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t("messages.failedToSave"));
      }

      const result = await response.json();
      router.push(`/events/${result.event.id}`);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : t("messages.failedToSave")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tagNames.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tagNames: [...prev.tagNames, tag],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tagNames: prev.tagNames.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{t("auth.signInToCreateEvents")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {eventId ? t("events.editEvent") : t("events.createNewEvent")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("events.eventTitle")} *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t("forms.placeholders.eventTitle")}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("events.description")}
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("forms.placeholders.eventDescription")}
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("events.location")}
            </label>
            <GooglePlacesAutocomplete
              onPlaceSelect={handlePlaceSelect}
              placeholder={t("forms.placeholders.eventLocation")}
              defaultValue={formData.locationAddress || formData.location}
            />

            {/* Show map preview if location is selected */}
            {formData.locationLat && formData.locationLng && (
              <div className="mt-3">
                <GoogleMapPreview
                  lat={formData.locationLat}
                  lng={formData.locationLng}
                  address={formData.locationAddress || formData.location}
                  locationName={formData.locationName}
                  height="150px"
                />
              </div>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("events.startDate")} *
              </label>
              <input
                type="datetime-local"
                id="startDate"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("events.endDate")}
              </label>
              <input
                type="datetime-local"
                id="endDate"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label
              htmlFor="maxCapacity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("events.maxCapacity")}
            </label>
            <input
              type="number"
              id="maxCapacity"
              min="1"
              value={formData.maxCapacity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  maxCapacity: e.target.value,
                }))
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.maxCapacity ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t("forms.placeholders.unlimitedCapacity")}
            />
            {errors.maxCapacity && (
              <p className="mt-1 text-sm text-red-600">{errors.maxCapacity}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {t("events.unlimitedCapacity")}
            </p>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("events.visibility")}
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  checked={formData.isPublic}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, isPublic: true }))
                  }
                  className="mr-2"
                />
                <span className="text-sm">{t("events.publicDescription")}</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  checked={!formData.isPublic}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, isPublic: false }))
                  }
                  className="mr-2"
                />
                <span className="text-sm">
                  {t("events.privateDescription")}
                </span>
              </label>
            </div>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("events.categories")}
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                      formData.categoryIds.includes(category.id)
                        ? "text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    style={{
                      backgroundColor: formData.categoryIds.includes(
                        category.id
                      )
                        ? category.color || "#6B7280"
                        : undefined,
                    }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("events.tags")}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tagNames.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("events.addTags")}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                {t("events.add")}
              </button>
            </div>
          </div>

          {/* Images */}
          {eventId && (
            <div>
              <ImageUpload
                eventId={eventId}
                images={images}
                onImagesChange={setImages}
                isOwner={true}
              />
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading
                ? t("events.saving")
                : eventId
                ? t("events.updateEvent")
                : t("events.createEvent")}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              {t("common.cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
