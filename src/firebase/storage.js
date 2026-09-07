import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { db, storage } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// ======================================================
// CLOUDINARY CONFIGURATION
// ======================================================

const CLOUDINARY_CLOUD_NAME =
  import.meta.env
    .VITE_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;

const CLOUDINARY_UPLOAD_URL =
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

// ======================================================
// BUILD CLOUDINARY RAW PDF URL (Moved up for safe calls)
// ======================================================

function buildCloudinaryRawURL(
  publicId
) {
  if (!publicId) {
    return null;
  }

  return (
    `https://res.cloudinary.com/` +
    `${CLOUDINARY_CLOUD_NAME}/raw/upload/` +
    publicId
  );
}

// ======================================================
// RESUME (Updated to Cloudinary & Firestore Sync)
// ======================================================

export async function uploadResume(file) {
  if (!file) {
    throw new Error("No resume file selected.");
  }

  if (file.type !== "application/pdf") {
    throw new Error("Please upload a PDF file only.");
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Resume PDF must be smaller than 10 MB.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "portfolio/resume");

  const response = await fetch(
    CLOUDINARY_UPLOAD_URL,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(
      "Cloudinary resume upload error:",
      data
    );

    throw new Error(
      data?.error?.message ||
      "Resume upload failed."
    );
  }

  const resumeData = {
    fileUrl: data.secure_url,
    secureUrl: data.secure_url,
    url: data.secure_url,
    fileName: file.name,
    publicId: data.public_id,
    resourceType: data.resource_type,
    format: data.format,
    bytes: data.bytes,
    cloudinaryAssetId: data.asset_id,
    originalFilename: data.original_filename,
    updatedAt: new Date().toISOString(),
  };

  const metaRef = doc(db, "portfolio", "resume");
  await setDoc(metaRef, resumeData, { merge: true });

  console.log("Resume uploaded and saved to Firestore successfully:", resumeData);

  return resumeData;
}

export async function getResumeURL(resume) {
  try {
    if (!resume) {
      const metaRef = doc(db, "portfolio", "resume");
      const snap = await getDoc(metaRef);
      if (snap.exists()) {
        resume = snap.data();
      } else {
        return null;
      }
    }

    if (
      typeof resume === "string"
    ) {
      if (
        resume.startsWith(
          "http://"
        ) ||
        resume.startsWith(
          "https://"
        )
      ) {
        return resume;
      }

      return buildCloudinaryRawURL(
        resume
      );
    }

    if (
      resume.url
    ) {
      return resume.url;
    }

    if (
      resume.fileUrl
    ) {
      return resume.fileUrl;
    }

    if (
      resume.secureUrl
    ) {
      return resume.secureUrl;
    }

    if (
      resume.publicId
    ) {
      return buildCloudinaryRawURL(
        resume.publicId
      );
    }

    if (
      resume.storagePath
    ) {
      const resumeRef =
        ref(
          storage,
          resume.storagePath
        );

      return await getDownloadURL(
        resumeRef
      );
    }

    return null;

  } catch (error) {
    if (
      error.code ===
      "storage/object-not-found"
    ) {
      console.warn(
        "Resume file not found:",
        resume
      );

      return null;
    }

    if (
      error.code ===
      "storage/unauthorized"
    ) {
      console.warn(
        "Resume file access denied."
      );

      return null;
    }

    console.error(
      "Error getting resume URL:",
      error
    );

    return null;
  }
}

export async function deleteResume() {
  try {
    const metaRef = doc(db, "portfolio", "resume");
    await setDoc(
      metaRef,
      {
        url: null,
        fileUrl: null,
        secureUrl: null,
        publicId: null,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw error;
  }
}

// ======================================================
// CLOUDINARY PROFILE PHOTO UPLOAD (Hero Section Updated)
// ======================================================

export async function uploadPhotoFile(file) {
  if (!file) {
    throw new Error("Please select a photo file.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload an image file only.");
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("Photo must be smaller than 5 MB.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "portfolio/photo");

  const response = await fetch(
    CLOUDINARY_UPLOAD_URL,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(
      "Cloudinary photo upload error:",
      data
    );

    throw new Error(
      data?.error?.message ||
      "Photo upload failed."
    );
  }

  const photoData = {
    fileUrl: data.secure_url,
    secureUrl: data.secure_url,
    url: data.secure_url,
    fileName: file.name,
    publicId: data.public_id,
    resourceType: data.resource_type,
    format: data.format,
    bytes: data.bytes,
    cloudinaryAssetId: data.asset_id,
    originalFilename: data.original_filename,
    updatedAt: new Date().toISOString(),
  };

  // Automatically sync and save photo metadata to Firestore under portfolio/hero (or hero metadata)
  const heroRef = doc(db, "portfolio", "hero");
  await setDoc(heroRef, { imageUrl: data.secure_url }, { merge: true });

  console.log("Hero photo uploaded and synced to Firestore successfully:", photoData);

  return photoData;
}

export async function getHeroPhotoURL(photo) {
  try {
    if (!photo) {
      const heroRef = doc(db, "portfolio", "hero");
      const snap = await getDoc(heroRef);
      if (snap.exists()) {
        photo = snap.data().imageUrl || snap.data();
      } else {
        return null;
      }
    }

    if (typeof photo === "string") {
      if (photo.startsWith("http://") || photo.startsWith("https://")) {
        return photo;
      }
      return buildCloudinaryRawURL(photo);
    }

    return photo.url || photo.fileUrl || photo.secureUrl || null;
  } catch (error) {
    console.error("Error getting hero photo URL:", error);
    return null;
  }
}

export async function deleteHeroPhoto() {
  try {
    const heroRef = doc(db, "portfolio", "hero");
    await setDoc(
      heroRef,
      {
        imageUrl: null,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("Error deleting hero photo:", error);
    throw error;
  }
}

// ======================================================
// CLOUDINARY CERTIFICATES
// ======================================================

// ======================================================
// UPLOAD CERTIFICATE PDF
// ======================================================

export async function uploadCertificateFile(
  file
) {
  if (!file) {
    throw new Error(
      "Please select a certificate file."
    );
  }

  if (
    file.type !== "application/pdf"
  ) {
    throw new Error(
      "Please upload a PDF certificate only."
    );
  }

  const maxSize =
    10 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(
      "Certificate PDF must be smaller than 10 MB."
    );
  }

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  formData.append(
    "upload_preset",
    CLOUDINARY_UPLOAD_PRESET
  );

  formData.append(
    "folder",
    "portfolio/certificates"
  );

  const response =
    await fetch(
      CLOUDINARY_UPLOAD_URL,
      {
        method: "POST",
        body: formData,
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    console.error(
      "Cloudinary upload error:",
      data
    );

    throw new Error(
      data?.error?.message ||
      "Certificate upload failed."
    );
  }

  return {
    fileUrl:
      data.secure_url,

    secureUrl:
      data.secure_url,

    fileName:
      file.name,

    publicId:
      data.public_id,

    resourceType:
      data.resource_type,

    format:
      data.format,

    bytes:
      data.bytes,

    cloudinaryAssetId:
      data.asset_id,

    originalFilename:
      data.original_filename,
  };
}

// ======================================================
// GET CERTIFICATE FILE URL
// ======================================================

export async function getCertificateFileURL(
  certificate
) {
  try {
    if (!certificate) {
      return null;
    }

    if (
      typeof certificate === "string"
    ) {
      if (
        certificate.startsWith(
          "http://"
        ) ||
        certificate.startsWith(
          "https://"
        )
      ) {
        return certificate;
      }

      return buildCloudinaryRawURL(
        certificate
      );
    }

    if (
      certificate.fileUrl
    ) {
      return certificate.fileUrl;
    }

    if (
      certificate.secureUrl
    ) {
      return certificate.secureUrl;
    }

    if (
      certificate.publicId
    ) {
      return buildCloudinaryRawURL(
        certificate.publicId
      );
    }

    if (
      certificate.storagePath
    ) {
      const certificateRef =
        ref(
          storage,
          certificate.storagePath
        );

      return await getDownloadURL(
        certificateRef
      );
    }

    if (
      certificate.pdf
    ) {
      if (
        certificate.pdf.startsWith(
          "http://"
        ) ||
        certificate.pdf.startsWith(
          "https://"
        ) ||
        certificate.pdf.startsWith(
          "/"
        )
      ) {
        return certificate.pdf;
      }

      const certificateRef =
        ref(
          storage,
          certificate.pdf
        );

      return await getDownloadURL(
        certificateRef
      );
    }

    return null;

  } catch (error) {

    if (
      error.code ===
      "storage/object-not-found"
    ) {
      console.warn(
        "Certificate file not found:",
        certificate
      );

      return null;
    }

    if (
      error.code ===
      "storage/unauthorized"
    ) {
      console.warn(
        "Certificate file access denied."
      );

      return null;
    }

    console.error(
      "Error getting certificate URL:",
      error
    );

    return null;
  }
}

// ======================================================
// DELETE CERTIFICATE FILE
// ======================================================

export async function deleteCertificateFile(
  storagePath
) {
  console.warn(
    "Cloudinary certificate deletion must be handled server-side.",
    storagePath
  );

  return true;
}