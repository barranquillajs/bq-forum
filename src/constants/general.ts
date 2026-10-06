export const SITE = {
  NAME: "Foro",
  AUTHOR: "Jesús Bossa",
  EMAIL: "barranquillajsx@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 20,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME = {
  TITLE: "El foro de Barranquilla JS",
  DESCRIPTION:
    "Un foro para compartir opinión de programación y la vida. Sientete como en casa.",
};

export const POSTS_PER_PAGE = 6;

export const COOKIES_MAX_AGE = 60 * 60 * 24 * 30;

export const COOKIES_STANDARD_OPTIONS = {
  httpOnly: true,
  secure: import.meta.env.PROD,
  sameSite: "lax" as any,
  path: "/",
  maxAge: COOKIES_MAX_AGE,
};
