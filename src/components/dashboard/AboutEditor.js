"use client";

import { useActionState, useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";
import {
  removeAboutImageAction,
  removeCvAction,
  saveAboutContentAction,
  uploadAboutImageAction,
  uploadCvAction,
} from "@/app/dashboard-araf/aboutActions";
import { ConfirmModal, StatusModal } from "@/components/dashboard/Modal";
import {
  DEFAULT_ABOUT_VISIBILITY,
  introHtmlToMarkup,
  introMarkupToHtml,
  normalizeAboutVisibility,
  stripIntroMarkup,
} from "@/lib/aboutContent";

const initialState = { error: null, success: false, message: null, content: null };

function aboutSaveSnapshot(content, interestsText) {
  return JSON.stringify({
    headlinePrefix: content?.headlinePrefix ?? "",
    headlineHighlight: content?.headlineHighlight ?? "",
    headlineSuffix: content?.headlineSuffix ?? "",
    intro: content?.intro ?? "",
    primaryCta: content?.primaryCta ?? "",
    secondaryCta: content?.secondaryCta ?? "",
    summary: content?.summary ?? "",
    interests: interestsText ?? "",
    visibility: normalizeAboutVisibility(content?.visibility),
    cvUrl: content?.cvUrl ?? "",
    imageUrl: content?.imageUrl ?? "",
  });
}

const fieldClass =
  "w-full rounded-lg border-0 bg-surface-container-high px-3 py-2.5 text-[13px] text-on-surface outline-none placeholder:text-on-surface-variant/45 focus:ring-1 focus:ring-primary/40 transition-shadow";

const labelClass = "block text-[12px] text-on-surface-variant mb-1.5";

function VisibilityToggle({ id, label, checked, onChange }) {
  return (
    <label
      htmlFor={id}
      className="inline-flex cursor-pointer items-center gap-1.5 select-none"
      title={checked ? "Visible on portfolio" : "Hidden on portfolio"}
    >
      <span className="text-[10px] text-on-surface-variant/80">
        {checked ? "Shown" : "Hidden"}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${label}: ${checked ? "shown" : "hidden"} on portfolio`}
        onClick={() => onChange(!checked)}
        className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${
          checked ? "bg-on-surface-variant/55" : "bg-surface-container-high"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-on-surface shadow-sm transition-transform ${
            checked ? "translate-x-3" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}

function SectionHeader({ icon, title, visibilityKey, visibility, onToggle }) {
  return (
    <div className="mb-1 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
          {icon}
        </span>
        <h2 className="text-[15px] font-medium text-on-surface truncate">{title}</h2>
      </div>
      <VisibilityToggle
        id={`vis-${visibilityKey}`}
        label={title}
        checked={visibility[visibilityKey]}
        onChange={(next) => onToggle(visibilityKey, next)}
      />
    </div>
  );
}

export default function AboutEditor({ initialContent }) {
  const introRef = useRef(null);
  const fileRef = useRef(null);
  const imageFileRef = useRef(null);
  const seededIntroRef = useRef(false);
  const [state, formAction, pending] = useActionState(saveAboutContentAction, initialState);
  const [uploadState, uploadAction, uploading] = useActionState(uploadCvAction, initialState);
  const [imageUploadState, imageUploadAction, imageUploading] = useActionState(
    uploadAboutImageAction,
    initialState
  );
  const [removing, startRemove] = useTransition();
  const [removingImage, startRemoveImage] = useTransition();
  const [removeError, setRemoveError] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [flash, setFlash] = useState(null);
  const [content, setContent] = useState(() => ({
    ...initialContent,
    visibility: normalizeAboutVisibility(
      initialContent?.visibility ?? DEFAULT_ABOUT_VISIBILITY
    ),
  }));
  const [interestsText, setInterestsText] = useState(
    (initialContent?.interests ?? []).join("\n")
  );
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    aboutSaveSnapshot(
      {
        ...initialContent,
        visibility: normalizeAboutVisibility(
          initialContent?.visibility ?? DEFAULT_ABOUT_VISIBILITY
        ),
      },
      (initialContent?.interests ?? []).join("\n")
    )
  );

  useLayoutEffect(() => {
    if (!introRef.current || seededIntroRef.current) return;
    introRef.current.innerHTML = introMarkupToHtml(initialContent?.intro ?? "");
    seededIntroRef.current = true;
  }, [initialContent]);

  useEffect(() => {
    if (state?.success && state.content) {
      const next = {
        ...state.content,
        visibility: normalizeAboutVisibility(state.content.visibility),
      };
      const nextInterests = (state.content.interests ?? []).join("\n");
      setContent(next);
      setInterestsText(nextInterests);
      setSavedSnapshot(aboutSaveSnapshot(next, nextInterests));
      if (introRef.current) {
        introRef.current.innerHTML = introMarkupToHtml(state.content.intro ?? "");
      }
    }
  }, [state]);

  useEffect(() => {
    if (uploadState?.success && uploadState.content) {
      const next = {
        ...uploadState.content,
        visibility: normalizeAboutVisibility(uploadState.content.visibility),
      };
      setContent(next);
      setSavedSnapshot((prev) => {
        // Keep interests text; only media URLs changed via upload
        const interests = JSON.parse(prev).interests ?? "";
        return aboutSaveSnapshot(next, interests);
      });
      if (fileRef.current) fileRef.current.value = "";
    }
  }, [uploadState]);

  useEffect(() => {
    if (imageUploadState?.success && imageUploadState.content) {
      const next = {
        ...imageUploadState.content,
        visibility: normalizeAboutVisibility(imageUploadState.content.visibility),
      };
      setContent(next);
      setSavedSnapshot((prev) => {
        const interests = JSON.parse(prev).interests ?? "";
        return aboutSaveSnapshot(next, interests);
      });
      if (imageFileRef.current) imageFileRef.current.value = "";
    }
  }, [imageUploadState]);

  useEffect(() => {
    const error =
      state?.error || uploadState?.error || imageUploadState?.error || removeError;
    if (error) {
      setFlash({ type: "error", text: error });
      return;
    }
    if (state?.success && state.message) {
      setFlash({ type: "success", text: state.message });
      return;
    }
    if (uploadState?.success && uploadState.message) {
      setFlash({ type: "success", text: uploadState.message });
      return;
    }
    if (imageUploadState?.success && imageUploadState.message) {
      setFlash({ type: "success", text: imageUploadState.message });
    }
  }, [state, uploadState, imageUploadState, removeError]);

  useEffect(() => {
    if (!flash) return undefined;
    const timer = window.setTimeout(() => setFlash(null), 2000);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const closeFlash = () => setFlash(null);

  const update = (key) => (e) => {
    setContent((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const setVisibility = (key, value) => {
    setContent((prev) => ({
      ...prev,
      visibility: {
        ...normalizeAboutVisibility(prev.visibility),
        [key]: value,
      },
    }));
  };

  const syncIntroFromEditor = () => {
    const html = introRef.current?.innerHTML ?? "";
    const markup = introHtmlToMarkup(html);
    setContent((prev) => ({ ...prev, intro: markup }));
  };

  const boldSelection = () => {
    const el = introRef.current;
    if (!el) return;
    el.focus();
    document.execCommand("bold", false);
    syncIntroFromEditor();
  };

  const handleRemoveCv = () => {
    setRemoveError(null);
    startRemove(async () => {
      const result = await removeCvAction();
      setConfirmAction(null);
      if (result?.error) {
        setRemoveError(result.error);
        return;
      }
      if (result?.content) {
        setContent({
          ...result.content,
          visibility: normalizeAboutVisibility(result.content.visibility),
        });
        setSavedSnapshot((prev) => {
          const interests = JSON.parse(prev).interests ?? "";
          return aboutSaveSnapshot(
            {
              ...result.content,
              visibility: normalizeAboutVisibility(result.content.visibility),
            },
            interests
          );
        });
        setFlash({
          type: "success",
          title: "Deleted",
          text: result.message || "CV removed.",
        });
      }
    });
  };

  const handleRemoveImage = () => {
    setRemoveError(null);
    startRemoveImage(async () => {
      const result = await removeAboutImageAction();
      setConfirmAction(null);
      if (result?.error) {
        setRemoveError(result.error);
        return;
      }
      if (result?.content) {
        setContent({
          ...result.content,
          visibility: normalizeAboutVisibility(result.content.visibility),
        });
        setSavedSnapshot((prev) => {
          const interests = JSON.parse(prev).interests ?? "";
          return aboutSaveSnapshot(
            {
              ...result.content,
              visibility: normalizeAboutVisibility(result.content.visibility),
            },
            interests
          );
        });
        setFlash({
          type: "success",
          title: "Deleted",
          text: result.message || "Image removed.",
        });
      }
    });
  };

  const requestRemoveImage = () => setConfirmAction("image");
  const requestRemoveCv = () => setConfirmAction("cv");

  const confirmPendingRemove = () => {
    if (confirmAction === "image") handleRemoveImage();
    else if (confirmAction === "cv") handleRemoveCv();
  };

  const visibility = normalizeAboutVisibility(content.visibility);
  const introEmpty = !stripIntroMarkup(content.intro ?? "").trim();
  const hasCv = Boolean(content.cvUrl?.trim());
  const hasImage = Boolean(content.imageUrl?.trim());
  const isDirty = aboutSaveSnapshot(content, interestsText) !== savedSnapshot;

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-6">
        <input type="hidden" name="intro" value={content.intro ?? ""} />
        <input type="hidden" name="cvUrl" value={content.cvUrl ?? ""} />
        <input type="hidden" name="imageUrl" value={content.imageUrl ?? ""} />
        <input type="hidden" name="visibility" value={JSON.stringify(visibility)} />

        <section className="rounded-xl bg-surface-container-lowest/90 p-4 space-y-4 sm:p-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[18px] text-primary">title</span>
            <h2 className="text-[15px] font-medium text-on-surface">Hero</h2>
          </div>
          <p className="text-[12px] text-on-surface-variant -mt-2">
            Use each toggle to show or hide that block on the public portfolio. Content is kept when
            hidden.
          </p>

          <div className="space-y-3 rounded-lg bg-surface-container-low/80 p-4">
            <SectionHeader
              icon="image"
              title="Profile image"
              visibilityKey="image"
              visibility={visibility}
              onToggle={setVisibility}
            />
            <p className="text-[12px] text-on-surface-variant leading-relaxed">
              Shown in the About hero on the portfolio. JPG, PNG, WebP, or GIF — max 3MB.
            </p>

            {hasImage ? (
              <div className="flex flex-wrap items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={content.imageUrl}
                  alt="About preview"
                  className="h-20 w-20 rounded-xl object-cover bg-surface-container"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={content.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-surface-container px-3 text-[12px] text-primary hover:bg-surface-container-high"
                  >
                    <span className="material-symbols-outlined !text-[16px]">open_in_new</span>
                    View
                  </a>
                  <button
                    type="button"
                    onClick={requestRemoveImage}
                    disabled={removingImage}
                    className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-error transition hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label={removingImage ? "Removing…" : "Remove"}
                    title={removingImage ? "Removing…" : "Remove"}
                  >
                    <span className="material-symbols-outlined !text-[16px]">
                      {removingImage ? "progress_activity" : "delete"}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[12px] text-on-surface-variant/70">No image uploaded yet.</p>
            )}

            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[200px] flex-1">
                <label htmlFor="about-image" className={`${labelClass} cursor-pointer`}>
                  {hasImage ? "Replace image" : "Upload image"}
                </label>
                <input
                  ref={imageFileRef}
                  id="about-image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
                  form="about-image-upload-form"
                  className="w-full cursor-pointer text-[12px] text-on-surface-variant file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-surface-container file:px-3 file:py-2 file:text-[12px] file:text-on-surface"
                />
              </div>
              <button
                type="submit"
                form="about-image-upload-form"
                disabled={imageUploading}
                className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary/20 px-4 text-[13px] font-semibold text-primary transition hover:bg-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[16px]">upload</span>
                {imageUploading ? "Uploading…" : "Upload"}
              </button>
            </div>
          </div>

          <div className="space-y-3 rounded-lg bg-surface-container-low/80 p-4">
            <SectionHeader
              icon="title"
              title="Headline"
              visibilityKey="headline"
              visibility={visibility}
              onToggle={setVisibility}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label htmlFor="headlinePrefix" className={labelClass}>
                  Headline prefix
                </label>
                <input
                  id="headlinePrefix"
                  name="headlinePrefix"
                  value={content.headlinePrefix}
                  onChange={update("headlinePrefix")}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="headlineHighlight" className={labelClass}>
                  Highlight word
                </label>
                <input
                  id="headlineHighlight"
                  name="headlineHighlight"
                  value={content.headlineHighlight}
                  onChange={update("headlineHighlight")}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="headlineSuffix" className={labelClass}>
                  Headline suffix
                </label>
                <input
                  id="headlineSuffix"
                  name="headlineSuffix"
                  value={content.headlineSuffix}
                  onChange={update("headlineSuffix")}
                  className={fieldClass}
                />
              </div>
            </div>

            <p className="rounded-lg bg-surface-container px-3 py-2 text-[13px] text-on-surface-variant">
              Preview:{" "}
              <span className="text-on-surface">
                {content.headlinePrefix}
                <span className="text-primary">{content.headlineHighlight}</span>
                {content.headlineSuffix}
              </span>
            </p>
          </div>

          <div className="space-y-3 rounded-lg bg-surface-container-low/80 p-4">
            <SectionHeader
              icon="notes"
              title="Intro"
              visibilityKey="intro"
              visibility={visibility}
              onToggle={setVisibility}
            />
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label htmlFor="intro-editor" className="text-[12px] text-on-surface-variant">
                  Intro text
                </label>
                <button
                  type="button"
                  onClick={boldSelection}
                  className="inline-flex h-7 items-center gap-1 rounded-md bg-surface-container px-2 text-[11px] font-medium text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
                  title="Select text, then click to bold"
                >
                  <span className="material-symbols-outlined !text-[14px]">format_bold</span>
                  Bold
                </button>
              </div>
              <div className="relative">
                {introEmpty ? (
                  <span className="pointer-events-none absolute left-3 top-2.5 text-[13px] text-on-surface-variant/45">
                    I&apos;m Arafat, a Software Engineer focused on…
                  </span>
                ) : null}
                <div
                  ref={introRef}
                  id="intro-editor"
                  role="textbox"
                  aria-multiline="true"
                  aria-label="Intro"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={syncIntroFromEditor}
                  onBlur={syncIntroFromEditor}
                  className={`${fieldClass} min-h-[72px] leading-relaxed [&_strong]:font-semibold [&_strong]:text-on-surface [&_b]:font-semibold [&_b]:text-on-surface`}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-on-surface-variant/80">
                Select your name (or any words), then click <strong>Bold</strong>. Bold shows
                directly in the field — no special characters.
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-lg bg-surface-container-low/80 p-4">
            <SectionHeader
              icon="smart_button"
              title="Primary button"
              visibilityKey="primaryCta"
              visibility={visibility}
              onToggle={setVisibility}
            />
            <div>
              <label htmlFor="primaryCta" className={labelClass}>
                Label
              </label>
              <input
                id="primaryCta"
                name="primaryCta"
                value={content.primaryCta}
                onChange={update("primaryCta")}
                className={fieldClass}
              />
              <p className="mt-1 text-[11px] text-on-surface-variant/70">
                Scrolls to the Projects section on the portfolio.
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-lg bg-surface-container-low/80 p-4">
            <SectionHeader
              icon="download"
              title="Secondary button"
              visibilityKey="secondaryCta"
              visibility={visibility}
              onToggle={setVisibility}
            />
            <div>
              <label htmlFor="secondaryCta" className={labelClass}>
                Label
              </label>
              <input
                id="secondaryCta"
                name="secondaryCta"
                value={content.secondaryCta}
                onChange={update("secondaryCta")}
                className={fieldClass}
              />
              <p className="mt-1 text-[11px] text-on-surface-variant/70">
                Opens the uploaded CV PDF in a new tab.
              </p>
            </div>

            <div className="space-y-3 rounded-lg bg-surface-container/80 p-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-tertiary">
                  picture_as_pdf
                </span>
                <h3 className="text-[13px] font-medium text-on-surface">CV PDF</h3>
              </div>
              <p className="text-[12px] text-on-surface-variant leading-relaxed">
                Upload a PDF for the secondary button. Visitors open it in a new tab. Max 5MB.
              </p>

              {hasCv ? (
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={content.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-surface-container-high px-3 text-[12px] text-primary hover:brightness-110"
                  >
                    <span className="material-symbols-outlined !text-[16px]">open_in_new</span>
                    View current CV
                  </a>
                  <button
                    type="button"
                    onClick={requestRemoveCv}
                    disabled={removing}
                    className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-error transition hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label={removing ? "Removing…" : "Remove CV"}
                    title={removing ? "Removing…" : "Remove CV"}
                  >
                    <span className="material-symbols-outlined !text-[16px]">
                      {removing ? "progress_activity" : "delete"}
                    </span>
                  </button>
                </div>
              ) : (
                <p className="text-[12px] text-on-surface-variant/70">No CV uploaded yet.</p>
              )}

              <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[200px] flex-1">
                  <label htmlFor="cv" className={`${labelClass} cursor-pointer`}>
                    {hasCv ? "Replace PDF" : "Upload PDF"}
                  </label>
                  <input
                    ref={fileRef}
                    id="cv"
                    name="cv"
                    type="file"
                    accept="application/pdf,.pdf"
                    form="cv-upload-form"
                    className="w-full cursor-pointer text-[12px] text-on-surface-variant file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-surface-container file:px-3 file:py-2 file:text-[12px] file:text-on-surface"
                  />
                </div>
                <button
                  type="submit"
                  form="cv-upload-form"
                  disabled={uploading}
                  className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-secondary/20 px-4 text-[13px] font-semibold text-secondary transition hover:bg-secondary/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  {uploading ? "Uploading…" : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-surface-container-lowest/90 p-4 space-y-4 sm:p-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[18px] text-secondary">person</span>
            <h2 className="text-[15px] font-medium text-on-surface">Summary & interests</h2>
          </div>

          <div className="space-y-3 rounded-lg bg-surface-container-low/80 p-4">
            <SectionHeader
              icon="subject"
              title="Summary"
              visibilityKey="summary"
              visibility={visibility}
              onToggle={setVisibility}
            />
            <div>
              <label htmlFor="summary" className={labelClass}>
                Summary text
              </label>
              <textarea
                id="summary"
                name="summary"
                required
                rows={5}
                value={content.summary}
                onChange={update("summary")}
                className={`${fieldClass} resize-y min-h-[120px]`}
              />
            </div>
          </div>

          <div className="space-y-3 rounded-lg bg-surface-container-low/80 p-4">
            <SectionHeader
              icon="interests"
              title="Interests"
              visibilityKey="interests"
              visibility={visibility}
              onToggle={setVisibility}
            />
            <div>
              <label htmlFor="interests" className={labelClass}>
                Interests (one per line)
              </label>
              <textarea
                id="interests"
                name="interests"
                rows={4}
                value={interestsText}
                onChange={(e) => setInterestsText(e.target.value)}
                className={`${fieldClass} resize-y font-label-mono text-[12px]`}
                placeholder={"Generative AI\nDistributed Systems"}
              />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={pending || introEmpty || !isDirty}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent bg-primary px-4 text-[13px] font-semibold text-on-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            {pending ? "Saving…" : "Save About"}
          </button>
        </div>
      </form>

      <form id="cv-upload-form" action={uploadAction} className="hidden" aria-hidden />
      <form
        id="about-image-upload-form"
        action={imageUploadAction}
        className="hidden"
        aria-hidden
      />

      <StatusModal
        open={Boolean(flash)}
        type={flash?.type === "error" ? "error" : "success"}
        title={flash?.title}
        message={flash?.text}
        onClose={closeFlash}
        autoCloseMs={2000}
      />

      <ConfirmModal
        open={confirmAction === "image" || confirmAction === "cv"}
        title="Are you sure?"
        message={
          confirmAction === "image"
            ? "Remove the About profile image? This cannot be undone."
            : confirmAction === "cv"
              ? "Remove the uploaded CV? This cannot be undone."
              : null
        }
        confirmLabel="Delete"
        confirming={removing || removingImage}
        onCancel={() => {
          if (removing || removingImage) return;
          setConfirmAction(null);
        }}
        onConfirm={confirmPendingRemove}
      />
    </div>
  );
}
