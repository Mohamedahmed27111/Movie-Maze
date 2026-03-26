# Movie Maze

A modern, responsive movie discovery app built with **React** and powered by the **TMDB API**. Explore trending, popular, top-rated, and upcoming movies with a clean dark-themed UI.

---

## Overview

Movie Maze lets you discover films with real-time search, genre browsing, advanced filters, and full movie detail pages including trailers, cast, and similar movies. All data comes from the TMDB API. Favorites and watchlists are persisted in `localStorage` � no backend required.

## Quick Start

```bash
git clone https://github.com/your-username/Movie-Maze.git
cd Movie-Maze
npm install
```

Create a `.env` file in the project root:

```
REACT_APP_TMDB_API_KEY=your_tmdb_read_access_token
```

> Use the **API Read Access Token (v4 auth)** from [TMDB settings](https://www.themoviedb.org/settings/api) � it starts with `eyJ�`

```bash
npm start   # http://localhost:3000
```

## Tech Stack

| | |
|---|---|
| React 19 | UI with hooks, context, lazy loading |
| React Router 7 | Client-side routing |
| Tailwind CSS 3 | Custom design token system |
| Swiper | Touch-friendly movie carousels |
| TMDB API | Movie data, images, metadata |

---

*This product uses the TMDB API but is not endorsed or certified by TMDB.*
