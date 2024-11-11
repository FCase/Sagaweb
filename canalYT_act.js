const apiKey = 'AIzaSyCPZAo26KrCpEHADcw-e1JCcGxZuPL7icI';
const channelId = 'UCYhtVZwxFRNbppFt4GYRK6A';
const maxResults = 4; 

const cachedVideos = JSON.parse(localStorage.getItem('youtubeVideosSaga'));
const lastFetchTime = localStorage.getItem('lastFetchTime');
const currentTime = new Date().getTime();

if (cachedVideos && lastFetchTime && (currentTime - lastFetchTime < 12 * 60 * 60 * 1000)) {
  // Si hay datos en caché y no ha pasado un día, usa los datos en caché
  displayVideos(cachedVideos);
} else {
  // Si no hay datos en caché o ha pasado un día, realiza una solicitud
  fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`)
    .then(response => response.json())
    .then(data => {
      // Almacena los datos y el tiempo de solicitud en el almacenamiento local
      localStorage.setItem('youtubeVideosSaga', JSON.stringify(data.items));
      localStorage.setItem('lastFetchTime', currentTime);
      displayVideos(data.items);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function displayVideos(videos) {
  let videosContainer = document.getElementById('videos');
  videosContainer.innerHTML = '';
  videos.forEach(item => {
    let video = document.createElement('div');
    video.innerHTML = `<iframe width=80% height="315" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>`;
    videosContainer.appendChild(video);
  });
}

