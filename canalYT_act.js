const apiKey = 'AIzaSyCPZAo26KrCpEHADcw-e1JCcGxZuPL7icI';
const playlistIds = ['PLFz2S11K1YEJN2MCBbmebs5BCmOoWyhBi&si=5gz-wXxqCO0JyEoK', 'PLFz2S11K1YEL93NPlpsP7KJHxQxoxTl6s&si=4apdYDEewoTQNiSI']; // Agrega más playlist IDs si lo necesitas
const maxResults = 4;
const videosContainer = document.getElementById('videos');

const cachedVideos = JSON.parse(localStorage.getItem('youtubeVideosSaga'));
const lastFetchTime = localStorage.getItem('lastFetchTime');
const currentTime = new Date().getTime();

if (cachedVideos && lastFetchTime && (currentTime - lastFetchTime < 12 * 60 * 60 * 1000)) {
  displayVideos(cachedVideos);
} else {
  let allVideos = [];
  Promise.all(
    playlistIds.map(playlistId =>
      fetch(`https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=snippet&maxResults=${maxResults}`)
        .then(response => response.json())
        .then(data => {
          allVideos = allVideos.concat(data.items);
        })
    )
  )
    .then(() => {
      // Ordenar videos por fecha de publicación descendente para mostrar los más recientes primero
      allVideos.sort((a, b) => new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt));

      // Almacenar los datos en caché y mostrar los videos ordenados
      localStorage.setItem('youtubeVideosSaga', JSON.stringify(allVideos));
      localStorage.setItem('lastFetchTime', currentTime);
      displayVideos(allVideos);
    })
    .catch(error => console.error('Error al obtener datos de la API:', error));
}

function displayVideos(videos) {
  videosContainer.innerHTML = '';
  videos.slice(0, maxResults).forEach(item => { // Mostrar solo los primeros `maxResults` videos después de ordenar
    const videoContainer = document.createElement('div');
    videoContainer.classList.add('video-container', 'col-md-4');
    videoContainer.innerHTML = `
      <iframe width="100%" height="315" src="https://www.youtube.com/embed/${item.snippet.resourceId.videoId}" frameborder="0" allowfullscreen></iframe>
    `;
    videosContainer.appendChild(videoContainer);
  });
}
