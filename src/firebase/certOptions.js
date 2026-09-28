import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

// NOTE: change this import if your Firestore instance is exported from a different file
import { db } from "./firebase";

const COLLECTION = "certOptions";

export function cleanLabel(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function slug(value) {
  return cleanLabel(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// One document per option. The id is "<kind>_<slug>", so the
// same option can never be saved twice (Power BI == power bi).
function optionId(kind, label) {
  return `${kind}_${slug(label)}`;
}

// Live list of custom options, grouped by kind.
// callback receives: { platform: [...], domain: [...], tech: [...] }
export function subscribeCertOptions(callback, onError) {
  return onSnapshot(
    collection(db, COLLECTION),
    (snapshot) => {
      const grouped = { platform: [], domain: [], tech: [] };

      snapshot.docs.forEach((d) => {
        const data = d.data();
        if (grouped[data.kind] && data.label) {
          grouped[data.kind].push(data.label);
        }
      });

      Object.keys(grouped).forEach((kind) =>
        grouped[kind].sort((a, b) => a.localeCompare(b))
      );

      callback(grouped);
    },
    (error) => {
      console.error("certOptions listener error:", error);
      onError?.(error);
    }
  );
}

export async function addCertOption(kind, label) {
  const clean = cleanLabel(label);
  if (!clean) return;

  await setDoc(doc(db, COLLECTION, optionId(kind, clean)), {
    kind,
    label: clean,
    labelLower: clean.toLowerCase(),
    createdAt: serverTimestamp(),
  });
}

export async function deleteCertOption(kind, label) {
  await deleteDoc(doc(db, COLLECTION, optionId(kind, label)));
}