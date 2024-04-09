import videojs from 'video.js';

function initVideoJS() {
    if (document.querySelectorAll('[data-video]').length) {
        const videos = document.querySelectorAll('[data-video]');
        videos.forEach((video) => {
            const data = video.dataset.video;
            const vjs = videojs(video, {
                controls: true,
                poster: data.length ? data : null
            });
        });
    }
}
initVideoJS();
