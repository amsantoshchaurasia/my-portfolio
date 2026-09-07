import { db } from "./firebase";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

// ======================================================
// CLOUDINARY CONFIGURATION FOR RESUME
// ======================================================

const CLOUDINARY_CLOUD_NAME =
  import.meta.env
    .VITE_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;

const CLOUDINARY_UPLOAD_URL =
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

function buildCloudinaryRawURL(publicId) {
  if (!publicId) return null;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/raw/upload/${publicId}`;
}

// ======================================================
// RESUME (Updated to Cloudinary)
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

  const downloadURL = data.secure_url;

  const metaRef = doc(db, "portfolio", "resume");
  await setDoc(
    metaRef,
    {
      url: downloadURL,
      secureUrl: downloadURL,
      fileUrl: downloadURL,
      publicId: data.public_id,
      fileName: file.name,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  return downloadURL;
}

export async function getResumeURL() {
  try {
    const metaRef = doc(db, "portfolio", "resume");
    const snap = await getDoc(metaRef);
    
    if (snap.exists()) {
      const data = snap.data();
      if (data.url) return data.url;
      if (data.fileUrl) return data.fileUrl;
      if (data.secureUrl) return data.secureUrl;
      if (data.publicId) return buildCloudinaryRawURL(data.publicId);
    }

    return null;
  } catch (error) {
    console.error("Error getting resume URL:", error);
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
// HERO
// ======================================================

export async function getHeroData() {
  const ref = doc(db, "portfolio", "hero");

  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data();
  }

  return null;
}


export async function updateHeroData(data) {
  const ref = doc(db, "portfolio", "hero");

  await setDoc(
    ref,
    data,
    {
      merge: true,
    }
  );
}


// ======================================================
// ABOUT
// ======================================================

export async function getAboutData() {
  const ref = doc(db, "portfolio", "about");

  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data();
  }

  return null;
}


export async function updateAboutData(data) {
  const ref = doc(db, "portfolio", "about");

  await setDoc(
    ref,
    data,
    {
      merge: true,
    }
  );
}


// ======================================================
// ABOUT STATS
// ======================================================

export async function getAboutStats() {
  const ref = doc(
    db,
    "portfolio",
    "aboutStats"
  );

  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data();
  }

  return null;
}


export async function updateAboutStats(data) {
  const ref = doc(
    db,
    "portfolio",
    "aboutStats"
  );

  await setDoc(
    ref,
    data,
    {
      merge: true,
    }
  );
}


// ======================================================
// SKILLS
// ======================================================

const skillsCollection = collection(
  db,
  "portfolio",
  "skills",
  "items"
);


export async function getSkills() {
  const snapshot =
    await getDocs(skillsCollection);

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs
    .map((skillDoc) => ({
      id: skillDoc.id,
      ...skillDoc.data(),
    }))
    .sort(
      (a, b) =>
        Number(a.order || 0) -
        Number(b.order || 0)
    );
}


export async function createSkill(data) {
  const newSkillRef =
    doc(skillsCollection);

  await setDoc(
    newSkillRef,
    data
  );

  return newSkillRef.id;
}


export async function updateSkill(
  id,
  data
) {
  const ref = doc(
    db,
    "portfolio",
    "skills",
    "items",
    id
  );

  await setDoc(
    ref,
    data,
    {
      merge: true,
    }
  );
}


export async function deleteSkill(id) {
  const ref = doc(
    db,
    "portfolio",
    "skills",
    "items",
    id
  );

  await deleteDoc(ref);
}


// ======================================================
// PROJECTS
// ======================================================

const projectsCollection = collection(
  db,
  "portfolio",
  "projects",
  "items"
);


export async function getProjects() {
  const snapshot =
    await getDocs(projectsCollection);

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs
    .map((projectDoc) => ({
      id: projectDoc.id,
      ...projectDoc.data(),
    }))
    .sort(
      (a, b) =>
        Number(a.order || 0) -
        Number(b.order || 0)
    );
}


export async function createProject(data) {
  const newProjectRef =
    doc(projectsCollection);

  await setDoc(
    newProjectRef,
    data
  );

  return newProjectRef.id;
}


export async function updateProject(
  id,
  data
) {
  const ref = doc(
    db,
    "portfolio",
    "projects",
    "items",
    id
  );

  await setDoc(
    ref,
    data,
    {
      merge: true,
    }
  );
}


export async function deleteProject(id) {
  const ref = doc(
    db,
    "portfolio",
    "projects",
    "items",
    id
  );

  await deleteDoc(ref);
}


// ======================================================
// CERTIFICATES
// ======================================================
//
// FIRESTORE PATH:
//
// portfolio
//     └── certificates
//           └── items
//               ├── certificate 1
//               ├── certificate 2
//               └── certificate 3
//
// ======================================================

const certificatesCollection =
  collection(
    db,
    "portfolio",
    "certificates",
    "items"
  );


// ======================================================
// GET ALL CERTIFICATES
// ======================================================

export async function getCertificates() {
  try {
    const snapshot =
      await getDocs(
        certificatesCollection
      );

    if (snapshot.empty) {
      return [];
    }

    const certificates =
      snapshot.docs.map(
        (certificateDoc) => ({
          id: certificateDoc.id,
          ...certificateDoc.data(),
        })
      );

    return certificates.sort(
      (a, b) =>
        Number(a.order || 0) -
        Number(b.order || 0)
    );

  } catch (error) {
    console.error(
      "Error getting certificates:",
      error
    );

    throw error;
  }
}


// ======================================================
// GET SINGLE CERTIFICATE
// ======================================================

export async function getCertificate(id) {
  try {
    if (!id) {
      throw new Error(
        "Certificate ID is required."
      );
    }

    const ref = doc(
      db,
      "portfolio",
      "certificates",
      "items",
      id
    );

    const snap =
      await getDoc(ref);

    if (!snap.exists()) {
      return null;
    }

    return {
      id: snap.id,
      ...snap.data(),
    };

  } catch (error) {
    console.error(
      "Error getting certificate:",
      error
    );

    throw error;
  }
}


// ======================================================
// CREATE CERTIFICATE
// ======================================================

export async function createCertificate(
  data
) {
  try {
    if (!data) {
      throw new Error(
        "Certificate data is required."
      );
    }

    const newCertificateRef =
      doc(certificatesCollection);

    await setDoc(
      newCertificateRef,
      {
        ...data,
        createdAt:
          data.createdAt ||
          new Date().toISOString(),

        updatedAt:
          new Date().toISOString(),
      }
    );

    return newCertificateRef.id;

  } catch (error) {
    console.error(
      "Error creating certificate:",
      error
    );

    throw error;
  }
}


// ======================================================
// UPDATE CERTIFICATE
// ======================================================

export async function updateCertificate(
  id,
  data
) {
  try {
    if (!id) {
      throw new Error(
        "Certificate ID is required."
      );
    }

    const ref = doc(
      db,
      "portfolio",
      "certificates",
      "items",
      id
    );

    await setDoc(
      ref,
      {
        ...data,
        updatedAt:
          new Date().toISOString(),
      },
      {
        merge: true,
      }
    );

    return true;

  } catch (error) {
    console.error(
      "Error updating certificate:",
      error
    );

    throw error;
  }
}


// ======================================================
// DELETE CERTIFICATE
// ======================================================

export async function deleteCertificate(
  id
) {
  try {
    if (!id) {
      throw new Error(
        "Certificate ID is required."
      );
    }

    const ref = doc(
      db,
      "portfolio",
      "certificates",
      "items",
      id
    );

    await deleteDoc(ref);

    return true;

  } catch (error) {
    console.error(
      "Error deleting certificate:",
      error
    );

    throw error;
  }
}


// ======================================================
// EXPERIENCE
// ======================================================

const experienceCollection =
  collection(
    db,
    "portfolio",
    "experience",
    "items"
  );


export async function getExperiences() {
  const snapshot =
    await getDocs(
      experienceCollection
    );

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs
    .map((experienceDoc) => ({
      id: experienceDoc.id,
      ...experienceDoc.data(),
    }))
    .sort(
      (a, b) =>
        Number(a.order || 0) -
        Number(b.order || 0)
    );
}


export const getExperience =
  getExperiences;


export async function createExperience(
  data
) {
  const newExperienceRef =
    doc(experienceCollection);

  await setDoc(
    newExperienceRef,
    data
  );

  return newExperienceRef.id;
}


export async function updateExperience(
  id,
  data
) {
  const ref = doc(
    db,
    "portfolio",
    "experience",
    "items",
    id
  );

  await setDoc(
    ref,
    data,
    {
      merge: true,
    }
  );
}


export async function deleteExperience(
  id
) {
  const ref = doc(
    db,
    "portfolio",
    "experience",
    "items",
    id
  );

  await deleteDoc(ref);
}


// ======================================================
// EDUCATION
// ======================================================

const educationCollection =
  collection(
    db,
    "portfolio",
    "education",
    "items"
  );


export async function getEducations() {
  const snapshot =
    await getDocs(
      educationCollection
    );

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs
    .map((educationDoc) => ({
      id: educationDoc.id,
      ...educationDoc.data(),
    }))
    .sort(
      (a, b) =>
        Number(a.order || 0) -
        Number(b.order || 0)
    );
}


export async function createEducation(
  data
) {
  const newEducationRef =
    doc(educationCollection);

  await setDoc(
    newEducationRef,
    data
  );

  return newEducationRef.id;
}


export async function updateEducation(
  id,
  data
) {
  const ref = doc(
    db,
    "portfolio",
    "education",
    "items",
    id
  );

  await setDoc(
    ref,
    data,
    {
      merge: true,
    }
  );
}


export async function deleteEducation(
  id
) {
  const ref = doc(
    db,
    "portfolio",
    "education",
    "items",
    id
  );

  await deleteDoc(ref);
}