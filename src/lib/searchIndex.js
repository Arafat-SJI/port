import {
  ABOUT,
  AWARDS,
  CLUBS,
  CONTACT,
  EDUCATION,
  EXPERIENCE,
  MENTORSHIP,
  NAV_ITEMS,
  PROJECTS,
  PUBLICATIONS,
  SKILLS,
} from "@/data/portfolio";
import { aboutSearchLines } from "@/lib/aboutContent";
import { experienceSearchLines } from "@/lib/experienceContent";
import { projectsSearchLines } from "@/lib/projectsContent";
import { skillsSearchLines } from "@/lib/skillsContent";

function linesForHref(
  href,
  aboutContent,
  experienceContent,
  skillsContent,
  projectsContent
) {
  switch (href) {
    case "#about":
      return aboutContent
        ? aboutSearchLines(aboutContent)
        : [ABOUT.summary, ...ABOUT.interests.map((i) => `interest: ${i}`)];
    case "#experience":
      return experienceContent
        ? experienceSearchLines(experienceContent)
        : EXPERIENCE.flatMap((e) => [e.role, e.company, e.description]);
    case "#skills":
      return skillsContent
        ? skillsSearchLines(skillsContent)
        : SKILLS.flatMap((g) => [g.title, ...g.items]);
    case "#projects":
      return projectsContent
        ? projectsSearchLines(projectsContent)
        : PROJECTS.flatMap((p) => [p.title, p.description, ...p.tags]);
    case "#education":
      return EDUCATION.flatMap((e) => [e.degree, e.institution, ...e.highlights]);
    case "#awards":
      return AWARDS.flatMap((a) => [a.title, a.issuer, a.description]);
    case "#publication":
      return PUBLICATIONS.flatMap((p) => [p.title, p.authors, p.venue]);
    case "#clubing":
      return CLUBS.flatMap((c) => [c.name, c.role, c.description]);
    case "#mentorship":
      return MENTORSHIP.flatMap((m) => [m.program, m.role, m.description, ...m.topics]);
    case "#contact":
      return [CONTACT.intro, CONTACT.email, CONTACT.social];
    case "#gallery":
      return ["Gallery images and event highlights"];
    default:
      return [];
  }
}

export function buildSearchIndex(
  aboutContent,
  experienceContent,
  skillsContent,
  projectsContent
) {
  return NAV_ITEMS.map((item) => ({
    ...item,
    path: `portfolio/src/sections/${item.label}`,
    lines: linesForHref(
      item.href,
      aboutContent,
      experienceContent,
      skillsContent,
      projectsContent
    ),
  }));
}

export const SEARCH_INDEX = buildSearchIndex();

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildMatcher(query, { matchCase, wholeWord, useRegex }) {
  if (!query) return null;

  if (useRegex) {
    try {
      return new RegExp(query, matchCase ? "" : "i");
    } catch {
      return null;
    }
  }

  const pattern = wholeWord ? `\\b${escapeRegex(query)}\\b` : escapeRegex(query);
  return new RegExp(pattern, matchCase ? "" : "i");
}

export function buildSearchMatcher(query, options) {
  return buildMatcher(query.trim(), options);
}

export function searchPortfolio(
  query,
  options,
  aboutContent,
  experienceContent,
  skillsContent,
  projectsContent
) {
  const matcher = buildMatcher(query.trim(), options);
  if (!matcher) return [];

  const index =
    aboutContent || experienceContent || skillsContent || projectsContent
      ? buildSearchIndex(
          aboutContent,
          experienceContent,
          skillsContent,
          projectsContent
        )
      : SEARCH_INDEX;

  return index.flatMap((file) => {
    const matches = [];

    if (matcher.test(file.label)) {
      matches.push({ line: 1, text: file.label, column: 0 });
    }

    file.lines.forEach((text, lineIndex) => {
      const match = matcher.exec(text);
      if (match) {
        matches.push({ line: lineIndex + 2, text, column: match.index });
      }
    });

    return matches.length ? [{ file, matches }] : [];
  });
}
