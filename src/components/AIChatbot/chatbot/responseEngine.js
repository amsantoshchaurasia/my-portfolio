import { doc, getDoc } from "firebase/firestore";

import { db } from "../../../firebase/firebase";

import {
  getHeroData,
  getAboutData,
  getAboutStats,
  getSkills,
  getProjects,
  getCertificates,
  getExperiences,
  getEducations,
} from "../../../firebase/firestore";

import {
  isValidQuestion,
  normalizeQuestion,
  getQuestionTerms,
} from "./questionMatcher";

import suggestedQuestions from "./suggestedQuestions";
import staticAnswers from "./staticAnswers";

/* =========================================================
   CONFIGURATION
========================================================= */

/*
  Unknown questions are allowed to wait for Gemini.

  If Gemini returns an error such as 503, 429, 500,
  the code automatically tries the next available model.
*/

const GEMINI_MODELS = [
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
];

/*
  Firebase cache lifetime.
*/
const FIREBASE_CACHE_TIME = 5 * 60 * 1000;


/* =========================================================
   FIREBASE CACHE
========================================================= */

let portfolioCache = null;
let portfolioCacheTime = 0;
let portfolioLoadingPromise = null;


/* =========================================================
   FIREBASE DATA LOADERS
========================================================= */

async function getContactData() {
  try {
    const ref = doc(db, "portfolio", "contact");
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
      return snapshot.data();
    }

    return null;
  } catch (error) {
    console.error(
      "Error loading contact data:",
      error
    );

    return null;
  }
}


async function getResumeData() {
  try {
    const ref = doc(db, "portfolio", "resume");
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
      return snapshot.data();
    }

    return null;
  } catch (error) {
    console.error(
      "Error loading resume data:",
      error
    );

    return null;
  }
}


async function getAIKnowledge() {
  try {
    const ref = doc(db, "portfolio", "aiKnowledge");
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
      return snapshot.data();
    }

    return null;
  } catch (error) {
    console.error(
      "Error loading AI knowledge:",
      error
    );

    return null;
  }
}


/* =========================================================
   CLEAN FIREBASE DATA
========================================================= */

function cleanData(value) {
  if (value === undefined) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map(cleanData);
  }

  if (
    value &&
    typeof value === "object"
  ) {
    const cleaned = {};

    Object.entries(value).forEach(
      ([key, item]) => {
        if (
          key !== "createdAt" &&
          key !== "updatedAt"
        ) {
          cleaned[key] = cleanData(item);
        }
      }
    );

    return cleaned;
  }

  return value;
}


/* =========================================================
   FETCH COMPLETE PORTFOLIO
========================================================= */

async function fetchPortfolioData() {
  console.log(
    "Loading portfolio data..."
  );

  const [
    hero,
    about,
    aboutStats,
    skills,
    projects,
    certificates,
    experience,
    education,
    contact,
    resume,
    aiKnowledge,
  ] = await Promise.all([
    getHeroData(),
    getAboutData(),
    getAboutStats(),
    getSkills(),
    getProjects(),
    getCertificates(),
    getExperiences(),
    getEducations(),
    getContactData(),
    getResumeData(),
    getAIKnowledge(),
  ]);

  const data = {
    hero: cleanData(hero),
    about: cleanData(about),
    aboutStats: cleanData(aboutStats),
    skills: cleanData(skills),
    projects: cleanData(projects),
    certificates: cleanData(certificates),
    experience: cleanData(experience),
    education: cleanData(education),
    contact: cleanData(contact),
    resume: cleanData(resume),
    aiKnowledge: cleanData(aiKnowledge),
  };

  console.log(
    "Portfolio data loaded and cached."
  );

  return data;
}


/* =========================================================
   LOAD PORTFOLIO WITH CACHE
========================================================= */

async function loadPortfolioData(
  forceRefresh = false
) {
  const now = Date.now();

  const cacheIsValid =
    portfolioCache &&
    now - portfolioCacheTime <
      FIREBASE_CACHE_TIME;

  /*
    Existing valid cache
  */

  if (
    !forceRefresh &&
    cacheIsValid
  ) {
    console.log(
      "Using cached portfolio data."
    );

    return portfolioCache;
  }


  /*
    If another request is already loading
    Firebase, reuse it.
  */

  if (portfolioLoadingPromise) {
    console.log(
      "Portfolio data request already running. Reusing it."
    );

    return portfolioLoadingPromise;
  }


  /*
    Load Firebase data.
  */

  portfolioLoadingPromise =
    fetchPortfolioData()
      .then((data) => {
        portfolioCache = data;
        portfolioCacheTime = Date.now();

        return data;
      })
      .catch((error) => {
        console.error(
          "Portfolio data loading error:",
          error
        );

        /*
          If old cache exists,
          use it instead of failing.
        */

        if (portfolioCache) {
          console.warn(
            "Using old portfolio cache."
          );

          return portfolioCache;
        }

        throw error;
      })
      .finally(() => {
        portfolioLoadingPromise = null;
      });

  return portfolioLoadingPromise;
}


/* =========================================================
   REFRESH CACHE
========================================================= */

export function refreshPortfolioCache() {
  portfolioCache = null;
  portfolioCacheTime = 0;

  console.log(
    "Portfolio cache cleared."
  );
}


/* =========================================================
   BUILD CONTEXT
========================================================= */

function buildContext(data) {
  return JSON.stringify(
    data,
    null,
    2
  );
}


/* =========================================================
   BUILD PROMPT
========================================================= */

function buildPrompt(
  userQuestion,
  portfolioData
) {
  const normalizedQuestion =
    normalizeQuestion(
      userQuestion
    );

  const questionTerms =
    getQuestionTerms(
      userQuestion
    );

  return `
You are "Santosh AI", the official AI assistant for Santosh Chaurasia's professional portfolio.

Your job is to answer questions about Santosh using ONLY the portfolio information provided below.

PORTFOLIO INFORMATION:
${buildContext(portfolioData)}

USER QUESTION:
${userQuestion}

NORMALIZED QUESTION:
${normalizedQuestion}

QUESTION TERMS:
${JSON.stringify(questionTerms)}

IMPORTANT RULES:

1. The portfolio information above is the only source of truth for facts about Santosh.

2. The aiKnowledge section may contain additional administrator-configured information. Use it when relevant.

3. Understand the information and answer naturally.

4. Never invent facts about Santosh.

5. Never guess or assume missing information.

6. Never use outside knowledge to create facts about Santosh.

7. If information is not available, clearly say:
"The information is not currently available in Santosh's portfolio."

8. Never invent:
- Location
- City
- Address
- Phone number
- Email
- Social links
- Company
- Job title
- Salary
- Dates
- Education
- Degree
- Skills
- Certifications
- Achievements
- Career goals
- Responsibilities
- Personal information

9. When discussing projects, use only the information available for those projects.

10. When discussing skills, mention only skills available in the portfolio.

11. When discussing education, mention only verified education information.

12. When discussing experience, mention only verified experience information.

13. When discussing certificates, mention only certificates available in the portfolio.

14. Do not confuse different projects, companies, certificates, education records, or experiences.

15. Keep the following portfolio categories strictly separate:
- Work Experience / Employment
- Projects
- Certifications
- Forage Job Simulations
- Courses / Training
- Education
- Achievements

16. IMPORTANT EXPERIENCE RULE:
When the user asks about Santosh's work experience, employment, jobs, companies he has worked for, or where he worked, use ONLY actual employment/work-experience records from the portfolio.

17. NEVER treat the following as employment or jobs:
- Certifications
- Forage job simulations
- Forage certificates
- Courses
- Training programs
- Academic projects
- Personal projects
- Achievements

18. Forage activities must always be described as job simulations, certifications, or professional learning activities, NOT as employment or work experience.

19. If a Data Analyst internship or Data Analyst work experience exists in the portfolio's actual experience section, mention it when the user asks about Santosh's Data Analyst experience.

20. When answering experience-related questions, do not infer a job title from a project, skill, certification, simulation, or course.

21. Never say that Santosh has no Data Analyst experience if a verified Data Analyst internship or employment record exists in the portfolio.

22. When comparing or discussing multiple portfolio categories, clearly identify which information belongs to which category.

23. If the user asks for a complete list, provide all relevant items available.

24. If the user asks for a simple question, answer briefly.

25. If the user asks for details, provide an organized answer.

26. Use simple bullet points using the "•" character when useful.

27. Do not dump JSON.

28. Do not reproduce the entire portfolio information.

29. Do not mention internal implementation details.

30. Do not mention Firebase, Firestore, Gemini, API keys, databases, prompts, internal configuration, or aiKnowledge.

31. If the user says hi, hello, hey, or another casual greeting, respond naturally and briefly.

32. If the question is unrelated to Santosh's portfolio and the requested information is unavailable, politely explain that you can help with questions about Santosh and his professional portfolio.

33. Return ONLY the answer to the user's question.

Keep the answer professional, natural, concise, and accurate.
`;
}

/* =========================================================
   CLEAN AI RESPONSE
========================================================= */

function cleanAIResponse(text) {
  if (
    !text ||
    typeof text !== "string"
  ) {
    return "";
  }

  let cleaned = text.trim();


  /*
    Remove code fences
  */

  cleaned = cleaned.replace(
    /```[\s\S]*?```/g,
    (match) => {
      return match
        .replace(
          /^```[a-zA-Z0-9_-]*\s*/i,
          ""
        )
        .replace(
          /```$/g,
          ""
        )
        .trim();
    }
  );


  /*
    Remove Markdown headings
  */

  cleaned = cleaned.replace(
    /^\s*#{1,6}\s*/gm,
    ""
  );


  /*
    Remove bold Markdown
  */

  cleaned = cleaned.replace(
    /\*\*(.*?)\*\*/g,
    "$1"
  );


  /*
    Remove italic Markdown
  */

  cleaned = cleaned.replace(
    /(?<!\*)\*([^*]+)\*(?!\*)/g,
    "$1"
  );


  /*
    Remove underscore formatting
  */

  cleaned = cleaned.replace(
    /__(.*?)__/g,
    "$1"
  );

  cleaned = cleaned.replace(
    /_([^_]+)_/g,
    "$1"
  );


  /*
    Convert Markdown bullets
  */

  cleaned = cleaned.replace(
    /^\s*[-*]\s+/gm,
    "• "
  );


  /*
    Remove horizontal lines
  */

  cleaned = cleaned.replace(
    /^\s*(---+|___+|\*\*\*+)\s*$/gm,
    ""
  );


  /*
    Remove excessive blank lines
  */

  cleaned = cleaned.replace(
    /\n{3,}/g,
    "\n\n"
  );


  /*
    Remove trailing spaces
  */

  cleaned = cleaned
    .split("\n")
    .map((line) =>
      line.trimEnd()
    )
    .join("\n")
    .trim();


  return cleaned;
}


/* =========================================================
   STATIC ANSWER LOOKUP
========================================================= */

function getStaticAnswer(
  userQuestion
) {
  try {
    if (
      !staticAnswers ||
      typeof staticAnswers !== "object"
    ) {
      return null;
    }

    const normalizedQuestion =
      normalizeQuestion(
        userQuestion
      );


    /*
      Exact normalized match
    */

    if (
      staticAnswers[
        normalizedQuestion
      ]
    ) {
      return staticAnswers[
        normalizedQuestion
      ].trim();
    }


    /*
      Normalize all static keys
    */

    const matchedKey =
      Object.keys(
        staticAnswers
      ).find(
        (key) =>
          normalizeQuestion(key) ===
          normalizedQuestion
      );

    if (matchedKey) {
      return staticAnswers[
        matchedKey
      ].trim();
    }


    return null;

  } catch (error) {
    console.error(
      "Static answer lookup error:",
      error
    );

    return null;
  }
}


/* =========================================================
   GENERIC FALLBACK
========================================================= */

function getGenericFallback() {
  return (
    "I couldn't find the requested information in Santosh's portfolio. " +
    "Please try another question about his skills, projects, education, experience, or certifications."
  );
}


/* =========================================================
   GEMINI REQUEST
========================================================= */

/*
  Gemini is now called through the backend.

  The Gemini API key is NOT used in this file.
  The backend keeps the API key server-side.
*/

async function requestGemini(
  model,
  promptText
) {
  console.log(
    `Sending Gemini request using backend with ${model}...`
  );

  const response =
    await fetch(
      "http://localhost:5000/api/chat",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          model,
          question: promptText,
        }),
      }
    );


  let data = null;

  try {
    data =
      await response.json();
  } catch (error) {
    console.error(
      "Unable to parse backend response:",
      error
    );
  }


  /*
    Successful backend response
  */

  if (
    response.ok &&
    data?.success
  ) {
    return {
      success: true,

      data: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text:
                    data.response || "",
                },
              ],
            },
          },
        ],
      },

      model,
    };
  }


  /*
    Backend error
  */

  return {
    success: false,
    status: response.status,
    data,
    model,
  };
}


/* =========================================================
   GEMINI MODEL FALLBACK
========================================================= */

async function getGeminiResponse(
  promptText
) {
  let lastError = null;


  for (
    let index = 0;
    index < GEMINI_MODELS.length;
    index++
  ) {
    const model =
      GEMINI_MODELS[index];

    try {
      const result =
        await requestGemini(
          model,
          promptText
        );


      /*
        SUCCESS
      */

      if (
        result.success
      ) {
        const responseText =
          result.data
            ?.candidates?.[0]
            ?.content?.parts
            ?.map(
              (part) =>
                part?.text || ""
            )
            .join("")
            .trim();


        /*
          Empty response
        */

        if (!responseText) {
          console.warn(
            `${model} returned an empty response.`
          );

          lastError =
            new Error(
              "Empty Gemini response"
            );

          continue;
        }


        /*
          Check finish reason
        */

        const finishReason =
          result.data
            ?.candidates?.[0]
            ?.finishReason;


        if (
          finishReason ===
            "SAFETY" ||
          finishReason ===
            "RECITATION"
        ) {
          console.warn(
            `${model} returned finish reason: ${finishReason}`
          );

          lastError =
            new Error(
              `Gemini finish reason: ${finishReason}`
            );

          continue;
        }


        if (
          finishReason ===
          "MAX_TOKENS"
        ) {
          console.warn(
            `${model} response reached MAX_TOKENS.`
          );

          /*
            We can still use the response
            if text exists.
          */
        }


        console.log(
          `Gemini response received from ${model}.`
        );

        return cleanAIResponse(
          responseText
        );
      }


      /*
        SERVER / RATE LIMIT ERRORS

        These are retryable.
      */

      if (
        result.status === 429 ||
        result.status === 500 ||
        result.status === 502 ||
        result.status === 503 ||
        result.status === 504
      ) {
        console.warn(
          `${model} returned ${result.status}. Trying next model...`
        );

        lastError =
          result.data?.error ||
          new Error(
            `Gemini HTTP ${result.status}`
          );

        continue;
      }


      /*
        Non-retryable errors
      */

      console.error(
        `Gemini API error from ${model}:`,
        result.data?.error ||
          result.data
      );

      return null;

    } catch (error) {
      console.error(
        `Gemini request failed for ${model}:`,
        error
      );

      lastError = error;

      /*
        Network errors:

        Try the next model instead
        of immediately failing.
      */

      continue;
    }
  }


  /*
    All models failed.
  */

  console.error(
    "All Gemini models failed.",
    lastError
  );

  return null;
}


/* =========================================================
   MAIN AI RESPONSE
========================================================= */

export async function getAIResponse(
  userQuestion
) {
  console.log(
    "AI question:",
    userQuestion
  );


  /* -------------------------------------------------------
     VALIDATE QUESTION
  ------------------------------------------------------- */

  if (
    !isValidQuestion(
      userQuestion
    )
  ) {
    return "Please enter a valid question.";
  }


  const normalizedQuestion =
    normalizeQuestion(
      userQuestion
    );

  console.log(
    "Normalized question:",
    normalizedQuestion
  );


  /* -------------------------------------------------------
     STATIC ANSWER FIRST
  ------------------------------------------------------- */

  const staticAnswer =
    getStaticAnswer(
      userQuestion
    );


  /*
    IMPORTANT:

    If exact static answer exists,
    Gemini is completely skipped.
  */

  if (staticAnswer) {
    console.log(
      "Static answer found. Gemini request skipped."
    );

    console.log(
      "Static response returned instantly."
    );

    return cleanAIResponse(
      staticAnswer
    );
  }


  try {

    /* -----------------------------------------------------
       LOAD PORTFOLIO DATA

       Cached after first load.
    ----------------------------------------------------- */

    console.log(
      "Loading portfolio data for unknown question..."
    );

    const portfolioData =
      await loadPortfolioData();


    /* -----------------------------------------------------
       BUILD PROMPT
    ----------------------------------------------------- */

    const promptText =
      buildPrompt(
        userQuestion,
        portfolioData
      );


    /* -----------------------------------------------------
       GEMINI REQUEST

       No frontend API key.
       No timeout.
    ----------------------------------------------------- */

    console.log(
      "Sending Gemini request for:",
      userQuestion
    );


    const responseText =
      await getGeminiResponse(
        promptText
      );


    /* -----------------------------------------------------
       GEMINI SUCCESS
    ----------------------------------------------------- */

    if (
      responseText
    ) {
      console.log(
        "Gemini response returned successfully."
      );

      return responseText;
    }


    /* -----------------------------------------------------
       GEMINI FAILED

       No static answer exists for this
       question, therefore generic fallback.
    ----------------------------------------------------- */

    console.warn(
      "Gemini could not generate a response."
    );

    return getGenericFallback();

  } catch (error) {

    console.error(
      "Santosh AI Error:",
      error
    );


    /*
      Static fallback if somehow
      available.
    */

    if (staticAnswer) {
      return cleanAIResponse(
        staticAnswer
      );
    }


    return getGenericFallback();
  }
}


/* =========================================================
   SUGGESTED QUESTIONS
========================================================= */

export function getAISuggestedQuestions() {
  try {

    /*
      Array format
    */

    if (
      Array.isArray(
        suggestedQuestions
      )
    ) {
      return suggestedQuestions
        .map((item) => {

          if (
            typeof item ===
            "string"
          ) {
            return item.trim();
          }


          if (
            item &&
            typeof item ===
              "object"
          ) {
            return (
              item.question ||
              item.text ||
              item.title ||
              ""
            ).trim();
          }


          return "";
        })
        .filter(Boolean)
        .slice(0, 6);
    }


    /*
      Object/category format
    */

    if (
      suggestedQuestions &&
      typeof suggestedQuestions ===
        "object"
    ) {

      let questions = [];


      /*
        Featured first
      */

      if (
        Array.isArray(
          suggestedQuestions.featured
        )
      ) {
        questions.push(
          ...suggestedQuestions.featured
        );
      }


      /*
        Other categories
      */

      Object.entries(
        suggestedQuestions
      ).forEach(
        ([category, items]) => {

          if (
            category ===
            "featured"
          ) {
            return;
          }


          if (
            Array.isArray(items)
          ) {
            questions.push(
              ...items
            );
          }
        }
      );


      /*
        Clean + remove duplicates
      */

      return [
        ...new Set(
          questions
            .map((item) => {

              if (
                typeof item ===
                "string"
              ) {
                return item.trim();
              }


              if (
                item &&
                typeof item ===
                  "object"
              ) {
                return (
                  item.question ||
                  item.text ||
                  item.title ||
                  ""
                ).trim();
              }


              return "";
            })
            .filter(Boolean)
        ),
      ].slice(0, 6);
    }


    return [];

  } catch (error) {
    console.error(
      "Error loading suggested questions:",
      error
    );

    return [];
  }
}