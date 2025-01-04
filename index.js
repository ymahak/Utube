const videoContainer = document.querySelector(".video-container");

let api_key = "AIzaSyBOxI67R7W2mseoaBGx-er-zs5gv63eLu4"; //api keyy 
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";
let nextPageToken = ""; // To store the token for the next page
let isFetching = false; // To prevent multiple simultaneous fetches

// Initial fetch
fetchVideos();

// Fetch videos function
function fetchVideos(pageToken = "") {
    if (isFetching) return; // Prevent fetching if already in progress
    isFetching = true;

    fetch(video_http + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        chart: 'mostPopular',
        maxResults: 20, // Fetch 20 videos at a time
        regionCode: 'IN',
        pageToken: pageToken // Use pageToken for pagination
    }))
    .then(res => res.json())
    .then(data => {
        nextPageToken = data.nextPageToken || ""; // Save nextPageToken for the next fetch
        data.items.forEach(item => getChannelIcon(item));
        isFetching = false;
    })
    .catch(err => {
        console.log(err);
        isFetching = false;
    });
}

// Fetch channel icon
function getChannelIcon(video_data) {
    fetch(channel_http + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        id: video_data.snippet.channelId
    }))
    .then(res => res.json())
    .then(data => {
        video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
        makeVideoCard(video_data);
    });
}

// Create video card
function makeVideoCard(data) {
    videoContainer.innerHTML += `
        <div class="video" onclick="location.href = 'https://youtube.com/watch?v=${data.id}'">
            <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
            <div class="content">
                <img src="${data.channelThumbnail}" class="channel-icon" alt="">
                <div class="info">
                    <h4 class="title">${data.snippet.title}</h4>
                    <p class="channel-name">${data.snippet.channelTitle}</p>
                </div>
            </div>
        </div>
    `;
}

// Infinite scrolling
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 100 && nextPageToken) {
        fetchVideos(nextPageToken); // Fetch next set of videos
    }
});

// Search logic
const searchInput = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");

let searchLink = "https://www.youtube.com/results?search_query=";
searchBtn.addEventListener("click", () => {
    if (searchInput.value.trim().length) {
        location.href = searchLink + searchInput.value.trim();
    }
});
