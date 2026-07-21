import { useState } from "react";
import { X, ArrowLeft, Check, Star, Plus, Hash } from "lucide-react";
import { Post, TAG_OPTIONS } from "../../lib/postModels";
import { geocodeAddress } from "../../lib/geocode";
import { PhotoUploader } from "./PhotoUploader";

interface AdminEditorProps {
  initialPost?: Post;
  allTags: string[];
  onPublish: (post: Post, newCustomTags?: string[]) => void;
  onCancel: () => void;
}

type RatingKey = "taste" | "vibe" | "location" | "value" | "presentation";
const RATING_KEYS: RatingKey[] = [
  "taste",
  "vibe",
  "location",
  "value",
  "presentation",
];

const PRESET_FLAVORS = [
  "Brambleberry Crisp",
  "Brown Butter Almond Brittle",
  "Honey Lavender",
  "Sea Salt with Caramel Ribbons",
  "Black Coconut Ash",
  "New York Cheesecake",
  "Turkish Coffee",
  "Eureka Lemon & Marionberry",
  "The Munchies",
  "Ooey Gooey Butter Cake",
  "Secret Breakfast",
  "Blue Bottle Vietnamese Coffee",
  "Strawberry Balsamic",
  "Toasted Coconut",
  "Miso Cherry",
  "Everything Bagel",
  "Vanilla Bean",
  "Chocolate Fudge",
  "Strawberry",
  "Mint Chip",
  "Rocky Road",
  "Cookies & Cream",
  "Salted Caramel",
  "Pistachio",
];

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={24}
            fill={(hover || value) >= i ? "#F59340" : "none"}
            color={(hover || value) >= i ? "#F59340" : "#D4B5A8"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

export function AdminEditor({
  initialPost,
  allTags,
  onPublish,
  onCancel,
}: AdminEditorProps) {
  const isEdit = !!initialPost;
  const [draftPostId] = useState(initialPost?.id ?? crypto.randomUUID());

  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [shopName, setShopName] = useState(initialPost?.shopName ?? "");
  const [address, setAddress] = useState(initialPost?.address ?? "");
  const [city, setCity] = useState(initialPost?.city ?? "");
  const [state, setState] = useState(initialPost?.state ?? "");
  const [date, setDate] = useState(
    initialPost?.date ?? new Date().toISOString().split("T")[0],
  );
  const [price, setPrice] = useState(initialPost?.price?.toString() ?? "");
  const [flavors, setFlavors] = useState<string[]>(initialPost?.flavors ?? []);
  const [customFlavor, setCustomFlavor] = useState("");
  const [extraFlavors, setExtraFlavors] = useState<string[]>(() => {
    if (!initialPost) return [];
    return initialPost.flavors.filter((f) => !PRESET_FLAVORS.includes(f));
  });
  const [showAllFlavors, setShowAllFlavors] = useState(false);
  const [description, setDescription] = useState(
    initialPost?.description ?? "",
  );
  const [tags, setTags] = useState<string[]>(initialPost?.tags ?? []);
  const [newTag, setNewTag] = useState("");
  const [newCustomTags, setNewCustomTags] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<RatingKey, number>>(
    initialPost?.ratings ?? {
      taste: 0,
      vibe: 0,
      location: 0,
      value: 0,
      presentation: 0,
    },
  );
  const [photos, setPhotos] = useState<string[]>(initialPost?.photos ?? []);
  const [errors, setErrors] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);

  const allPresetFlavors = [...PRESET_FLAVORS, ...extraFlavors];
  const COLLAPSED_COUNT = 12;
  const flavorRows = showAllFlavors
    ? allPresetFlavors
    : allPresetFlavors.slice(0, COLLAPSED_COUNT);
  const hasMore = allPresetFlavors.length > COLLAPSED_COUNT;

  function toggleFlavor(f: string) {
    setFlavors((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );
  }

  function addCustomFlavor() {
    const f = customFlavor.trim();
    if (!f) return;
    if (!PRESET_FLAVORS.includes(f) && !extraFlavors.includes(f)) {
      setExtraFlavors((prev) => [...prev, f]);
    }
    if (!flavors.includes(f)) setFlavors((prev) => [...prev, f]);
    setCustomFlavor("");
  }

  function toggleTag(t: string) {
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  function addNewTag() {
    const t = newTag
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    if (!t || allTags.includes(t)) return;
    setNewCustomTags((prev) => [...prev, t]);
    setTags((prev) => [...prev, t]);
    setNewTag("");
  }

  const allAvailableTags = [...new Set([...allTags, ...newCustomTags])];

  function validate() {
    const errs: string[] = [];
    if (!title.trim()) errs.push("Title is required");
    if (!shopName.trim()) errs.push("Shop name is required");
    if (!city.trim() || !state.trim()) errs.push("City and state are required");
    if (!price || isNaN(Number(price))) errs.push("Valid price is required");
    if (flavors.length === 0) errs.push("At least one flavor is required");
    if (!description.trim()) errs.push("Description is required");
    if (Object.values(ratings).some((v) => v === 0))
      errs.push("All ratings must be filled");
    return errs;
  }

  async function handlePublish() {
    const errs = validate();
    if (errs.length) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    setPublishing(true);
    try {
      const { lat, lng } = await geocodeAddress({
        street: address,
        city,
        state,
      });
      const post: Post = {
        id: draftPostId,
        title: title.trim(),
        shopName: shopName.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        lat,
        lng,
        date,
        flavors,
        price: parseFloat(price),
        photos: photos.filter((u) => u.trim()),
        ratings,
        description: description.trim(),
        tags,
        reactions: initialPost?.reactions ?? [],
        comments: initialPost?.comments ?? [],
      };
      onPublish(post, newCustomTags);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not look up that address. Try again.";
      setErrors([message]);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex items-center gap-3 border-b border-border">
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-xl transition-colors hover:bg-muted"
        >
          <ArrowLeft size={18} color="#8B6558" />
        </button>
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 700,
              color: "#1C0E0A",
            }}
          >
            {isEdit ? "Edit Post" : "New Post"}
          </h2>
          <p style={{ fontSize: 12, color: "#8B6558", marginTop: 1 }}>
            {isEdit
              ? `Editing: ${initialPost.shopName}`
              : "Share your latest ice cream adventure"}
          </p>
        </div>
      </div>

      <div className="px-4 py-5 space-y-6">
        {errors.length > 0 && (
          <div
            className="p-3 rounded-xl space-y-1"
            style={{
              background: "#FDE8EF",
              border: "1px solid rgba(193,65,90,0.2)",
            }}
          >
            {errors.map((e) => (
              <p key={e} style={{ fontSize: 13, color: "#C1415A" }}>
                • {e}
              </p>
            ))}
          </div>
        )}

        {/* Basics */}
        <Section title="The Basics">
          <Field label="Post Title">
            <TextInput
              value={title}
              onChange={setTitle}
              placeholder="e.g. Brambleberry Bliss at Jeni's"
            />
          </Field>
          <Field label="Shop Name">
            <TextInput
              value={shopName}
              onChange={setShopName}
              placeholder="e.g. Jeni's Splendid Ice Creams"
            />
          </Field>
          <Field label="Date Visited">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm"
              style={{
                background: "#FDF0E8",
                color: "#1C0E0A",
                fontFamily: "var(--font-body)",
              }}
            />
          </Field>
          <Field label="Price per Scoop ($)">
            <TextInput
              value={price}
              onChange={setPrice}
              placeholder="6.50"
              type="number"
            />
          </Field>
        </Section>

        {/* Location */}
        <Section title="Location">
          <Field label="Street Address">
            <TextInput
              value={address}
              onChange={setAddress}
              placeholder="714 N High St"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City">
              <TextInput
                value={city}
                onChange={setCity}
                placeholder="Columbus"
              />
            </Field>
            <Field label="State">
              <TextInput value={state} onChange={setState} placeholder="OH" />
            </Field>
          </div>
        </Section>

        {/* Photos */}
        <Section title="Photos">
          <PhotoUploader
            postId={draftPostId}
            photos={photos}
            onChange={setPhotos}
          />
        </Section>

        {/* Flavors */}
        <Section title="Flavors">
          <div
            style={{
              overflow: "hidden",
              maxHeight: showAllFlavors ? "none" : 112,
              transition: "max-height 0.3s ease",
            }}
          >
            <div className="flex flex-wrap gap-2">
              {flavorRows.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFlavor(f)}
                  className="px-3 py-1.5 rounded-full text-sm transition-all"
                  style={{
                    background: flavors.includes(f) ? "#C1415A" : "#F5EAE0",
                    color: flavors.includes(f) ? "#fff" : "#8B6558",
                  }}
                >
                  {flavors.includes(f) && (
                    <span style={{ marginRight: 4 }}>✓</span>
                  )}
                  {f}
                </button>
              ))}
            </div>
          </div>

          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAllFlavors(!showAllFlavors)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
              style={{ background: "#F5EAE0", color: "#8B6558" }}
            >
              {showAllFlavors
                ? "↑ Show less"
                : `↓ Show all ${allPresetFlavors.length} flavors`}
            </button>
          )}

          {/* Custom flavor input */}
          <div className="flex gap-2 pt-1">
            <TextInput
              value={customFlavor}
              onChange={setCustomFlavor}
              placeholder="Add a custom flavor…"
            />
            <button
              type="button"
              onClick={addCustomFlavor}
              className="px-4 py-3 rounded-xl text-sm font-medium shrink-0 transition-colors"
              style={{ background: "#FDE8EF", color: "#C1415A" }}
            >
              Add
            </button>
          </div>

          {/* Selected flavors summary */}
          {flavors.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {flavors.map((f) => (
                <span
                  key={f}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-sm"
                  style={{ background: "#FDE8EF", color: "#C1415A" }}
                >
                  {f}
                  <button type="button" onClick={() => toggleFlavor(f)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Section>

        {/* Ratings */}
        <Section title="Ratings">
          {RATING_KEYS.map((key) => (
            <div key={key} className="flex items-center justify-between py-0.5">
              <label
                className="text-sm font-medium capitalize"
                style={{ color: "#1C0E0A" }}
              >
                {key}
              </label>
              <StarPicker
                value={ratings[key]}
                onChange={(v) => setRatings((prev) => ({ ...prev, [key]: v }))}
              />
            </div>
          ))}
        </Section>

        {/* Write-up */}
        <Section title="The Write-Up">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the visit, the flavors, the atmosphere…"
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-primary resize-none text-sm"
            style={{
              background: "#FDF0E8",
              color: "#1C0E0A",
              fontFamily: "var(--font-body)",
              lineHeight: 1.6,
            }}
          />
        </Section>

        {/* Hashtags */}
        <Section title="Hashtags">
          {/* Existing tags */}
          <div className="flex flex-wrap gap-2">
            {allAvailableTags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                className="px-3 py-1.5 rounded-full text-sm transition-all"
                style={{
                  background: tags.includes(t) ? "#1C0E0A" : "#F5EAE0",
                  color: tags.includes(t) ? "#fff" : "#8B6558",
                }}
              >
                #{t}
              </button>
            ))}
          </div>

          {/* Create new tag */}
          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: "#8B6558" }}
            >
              Create a new hashtag
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Hash
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  color="#8B6558"
                />
                <input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addNewTag())
                  }
                  placeholder="my-custom-tag"
                  className="w-full pl-8 pr-3 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm"
                  style={{
                    background: "#FDF0E8",
                    color: "#1C0E0A",
                    fontFamily: "var(--font-body)",
                  }}
                />
              </div>
              <button
                type="button"
                onClick={addNewTag}
                className="px-4 py-3 rounded-xl text-sm font-medium shrink-0 flex items-center gap-1.5 transition-colors"
                style={{ background: "#1C0E0A", color: "#fff" }}
              >
                <Plus size={14} /> Create
              </button>
            </div>
            {newCustomTags.length > 0 && (
              <p className="text-xs mt-1.5" style={{ color: "#8B6558" }}>
                New tags: {newCustomTags.map((t) => `#${t}`).join(", ")} — will
                be added to the global list on publish
              </p>
            )}
          </div>
        </Section>

        <button
          onClick={handlePublish}
          disabled={publishing}
          className="w-full py-4 rounded-2xl font-semibold text-base transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
          style={{ background: "#C1415A", color: "#fff" }}
        >
          {publishing
            ? "Looking up address…"
            : isEdit
              ? "Save Changes 🍦"
              : "Publish Post 🍦"}
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 16,
          fontWeight: 600,
          color: "#1C0E0A",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label
        className="block text-xs font-semibold"
        style={{ color: "#8B6558" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm transition-colors"
      style={{
        background: "#FDF0E8",
        color: "#1C0E0A",
        fontFamily: "var(--font-body)",
      }}
    />
  );
}
