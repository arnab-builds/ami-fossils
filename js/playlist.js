// js/playlist.js

const playlist = [
    {
        id: "placeholder-01",
        title: "Ami Fossils (Local Track)",
        artist: "Fossils",
        src: "./assets/music/placeholder.mp3",
        cover: "./assets/images/placeholder.jpg"
    }
    // To add a new song, place the authorized audio file in assets/music/
    // Then add its metadata here:
    // {
    //     id: "track-02",
    //     title: "Another Song",
    //     artist: "Fossils",
    //     src: "./assets/music/track-02.mp3",
    //     cover: "./assets/images/track-02.jpg"
    // }
];

window.appPlaylist = playlist;

