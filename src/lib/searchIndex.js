import {
  ABOUT,
  AWARDS,
  CLUBS,
  CONTACT,
  EDUCATION,
  EXPERIENCE,
  GALLERY,
  MENTORSHIP,
  NAV_ITEMS,
  PROJECTS,
  PUBLICATIONS,
  SKILLS,
} from "@/data/portfolio";
import { aboutSearchLines } from "@/lib/aboutContent";
import { awardsSearchLines } from "@/lib/awardsContent";
import { clubingSearchLines } from "@/lib/clubingContent";
import { contactSearchLines } from "@/lib/contactContent";
import { educationSearchLines } from "@/lib/educationContent";
import { experienceSearchLines } from "@/lib/experienceContent";
import { gallerySearchLines } from "@/lib/galleryContent";
import { mentorshipSearchLines } from "@/lib/mentorshipContent";
import { projectsSearchLines } from "@/lib/projectsContent";
import { publicationSearchLines } from "@/lib/publicationContent";
import { skillsSearchLines } from "@/lib/skillsContent";

function linesForHref(href, content = {}) {
  const {
    aboutContent,
    experienceContent,
    skillsContent,
    projectsContent,
    educationContent,
    awardsContent,
    publicationContent,
    galleryContent,
    clubingContent,
    mentorshipContent,
    contactContent,
  } = content;

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
      return educationContent
        ? educationSearchLines(educationContent)
        : EDUCATION.flatMap((e) => [e.degree, e.institution, ...e.highlights]);
    case "#awards":
      return awardsContent
        ? awardsSearchLines(awardsContent)
        : AWARDS.flatMap((a) => [a.title, a.issuer, a.description]);
    case "#publication":
      return publicationContent
        ? publicationSearchLines(publicationContent)
        : PUBLICATIONS.flatMap((p) => [p.title, p.authors, p.venue]);
    case "#gallery":
      return galleryContent
        ? gallerySearchLines(galleryContent)
        : GALLERY.flatMap((g) => [g.caption, g.alt]);
    case "#clubing":
      return clubingContent
        ? clubingSearchLines(clubingContent)
        : CLUBS.flatMap((c) => [c.name, c.role, c.description]);
    case "#mentorship":
      return mentorshipContent
        ? mentorshipSearchLines(mentorshipContent)
        : MENTORSHIP.flatMap((m) => [m.program, m.role, m.description, ...m.topics]);
    case "#contact":
      return contactContent
        ? contactSearchLines(contactContent)
        : [CONTACT.intro, CONTACT.email, CONTACT.social];
    default:
      return [];
  }
}

export function buildSearchIndex(content = {}) {
  return NAV_ITEMS.map((item) => ({
    ...item,
    path: `portfolio/src/sections/${item.label}`,
    lines: linesForHref(item.href, content),
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

export function searchPortfolio(query, options, content = {}) {
  const matcher = buildMatcher(query.trim(), options);
  if (!matcher) return [];

  const hasLiveContent = Object.values(content).some(Boolean);
  const index = hasLiveContent ? buildSearchIndex(content) : SEARCH_INDEX;

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
