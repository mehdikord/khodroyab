"use client";

import { useEffect, useRef, useState } from "react";

import { AD_IMAGE_MAX_COUNT } from "@/lib/ad-form-shared";
import type { AdOptionValue, UserCarRecord } from "@/lib/user-cars";
import { toPersianDigits } from "@/lib/utils";
import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES } from "@/lib/validation/brands";

export type AdImageDraft =
  | { key: string; kind: "existing"; id: string; url: string }
  | { key: string; kind: "new"; file: File; url: string };

let imageCounter = 0;

/**
 * Form state of the sale-ad fields shared by the customer and admin forms:
 * photos (with the primary one), production year, colour and option values.
 */
export function useAdExtras(ad: UserCarRecord | null) {
  const [images, setImages] = useState<AdImageDraft[]>(() =>
    (ad?.images ?? []).map((image) => ({ key: `existing-${image.id}`, kind: "existing", id: image.id, url: image.url }))
  );
  const [primaryKey, setPrimaryKey] = useState<string | null>(() => {
    const primary = ad?.images.find((image) => image.isPrimary) ?? ad?.images[0];
    return primary ? `existing-${primary.id}` : null;
  });
  const [imageError, setImageError] = useState<string | null>(null);
  const [year, setYear] = useState(ad?.carYear ?? "");
  const [colorId, setColorId] = useState(ad?.colorId ?? "");
  const [optionValues, setOptionValues] = useState<Record<string, AdOptionValue>>(ad?.optionValues ?? {});

  // Object URLs of the previews are released when the form goes away.
  const imagesRef = useRef(images);
  imagesRef.current = images;
  useEffect(
    () => () => {
      for (const image of imagesRef.current) if (image.kind === "new") URL.revokeObjectURL(image.url);
    },
    []
  );

  function addFiles(files: FileList | null) {
    if (!files) return;
    setImageError(null);
    const accepted: AdImageDraft[] = [];
    for (const file of Array.from(files)) {
      if (images.length + accepted.length >= AD_IMAGE_MAX_COUNT) {
        setImageError(`حداکثر ${toPersianDigits(AD_IMAGE_MAX_COUNT)} تصویر برای هر آگهی مجاز است`);
        break;
      }
      if (!(ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type)) {
        setImageError(`فرمت «${file.name}» معتبر نیست؛ فقط PNG، JPG، WEBP و AVIF پذیرفته می‌شود`);
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setImageError(`حجم «${file.name}» بیشتر از ۲ مگابایت است`);
        continue;
      }
      imageCounter += 1;
      accepted.push({ key: `new-${imageCounter}`, kind: "new", file, url: URL.createObjectURL(file) });
    }
    if (accepted.length === 0) return;
    setImages((prev) => [...prev, ...accepted]);
    setPrimaryKey((prev) => prev ?? accepted[0].key);
  }

  function removeImage(key: string) {
    const target = images.find((image) => image.key === key);
    if (target?.kind === "new") URL.revokeObjectURL(target.url);
    const next = images.filter((image) => image.key !== key);
    setImages(next);
    if (primaryKey === key) setPrimaryKey(next[0]?.key ?? null);
  }

  function setOptionValue(optionId: string, value: AdOptionValue) {
    setOptionValues((prev) => ({ ...prev, [optionId]: value }));
  }

  /** Copy this state into the form payload read by `prepareAdExtras`. */
  function appendTo(formData: FormData) {
    formData.set("year", year);
    formData.set("colorId", colorId);
    formData.set("optionValues", JSON.stringify(optionValues));

    const keep: string[] = [];
    let newIndex = 0;
    let primaryToken = "";
    for (const image of images) {
      if (image.kind === "existing") {
        keep.push(image.id);
        if (image.key === primaryKey) primaryToken = `existing:${image.id}`;
      } else {
        formData.append("newImages", image.file);
        if (image.key === primaryKey) primaryToken = `new:${newIndex}`;
        newIndex += 1;
      }
    }
    formData.set("keepImageIds", JSON.stringify(keep));
    formData.set("primaryImage", primaryToken);
  }

  return {
    images,
    primaryKey,
    setPrimaryKey,
    imageError,
    addFiles,
    removeImage,
    year,
    setYear,
    colorId,
    setColorId,
    optionValues,
    setOptionValue,
    appendTo,
  };
}

export type AdExtrasState = ReturnType<typeof useAdExtras>;
