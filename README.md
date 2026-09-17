# Ami Fossils

Ami Fossils is an immersive virtual concert experience inspired by the Bengali rock band Fossils, designed to bring the atmosphere of a live concert into an interactive web experience.

## Project Overview

This project aims to simulate a live concert environment right from your browser. Currently, it features a local music architecture (HTML5 Audio), an interactive crowd soundboard, visual concert effects like lighters, overdrive mode, and falling confetti. 

## Current Architecture

The application is built using a lightweight, framework-free architecture:
- **HTML5:** Semantic structure and audio engine (`<audio>`).
- **CSS:** Modular styles for player, stage effects, and responsive design.
- **Vanilla JS:** Coordinates the local audio engine, playlist state, and stage effects. No backend or build tools required.

## Folder Structure

```
ami-fossils/
├── index.html       # Main application entry point
├── background.png   # Concert background image
├── css/             # Modular CSS files (base, player, concert, effects, responsive)
├── js/              # Modular JS files (app, player, playlist, effects, soundboard)
└── assets/
    ├── music/       # Place your authorized .mp3 files here
    ├── images/      # Place your album cover art here
    └── sounds/      # Future local concert sound effects
```

## How to Run Locally

1. Place your authorized audio files inside the `assets/music/` directory.
2. Update `js/playlist.js` with the track metadata (title, file path, cover image).
3. Open `index.html` in any modern web browser. No server is required.

## Current Features

- **Local Music Engine:** Plays standard audio files without external dependencies.
- **Stage Effects:** Lighters mode, Overdrive mode (screen shake & bass filter), and Encore mode (blackout & confetti).
- **Interactive Soundboard:** Crowd cheers, claps, and party poppers.
- **Immersive UI:** Spinning vinyl, dynamic play/pause icons, EQ visualizer, and custom audio seeking.

## Future Direction

Future phases will introduce advanced audio analysis (Web Audio API for real-time bass/beat detection), a 3D concert stage, dynamic lighting synchronization, crowd simulation, and a full setlist system.

