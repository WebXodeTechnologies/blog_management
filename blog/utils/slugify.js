import slugifyLib from "slugify";

export function createSlug(text = "") {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}
