function getIgPosts(user) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = 'https://www.instagram.com/' + user + '/?__a=1';

        xhr.open('GET', url);
        xhr.onload = () => resolve(formatIgPosts(xhr.responseText));
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
    });
}

function formatIgPosts(rawPosts) {
    let result = [];
    rawPosts = JSON.parse(rawPosts).graphql.user.edge_owner_to_timeline_media.edges;
    rawPosts.forEach(function (item) {
        if (typeof item.node.edge_media_to_caption.edges[0] != 'undefined')
            var caption = item.node.edge_media_to_caption.edges[0].node.text;
        else {
            var caption = '';
        }
        result.push({
            raw: item.node,
            image: item.node.display_url,
            dimensions: item.node.dimensions,
            likes: item.node.edge_liked_by.count,
            caption: caption,
            comments: item.node.edge_media_to_comment.count,
            video: item.node.is_video,
            code: item.node.shortcode,
            url: 'https://www.instagram.com/p/' + item.node.shortcode,
            timestamp: item.node.taken_at_timestamp,
            thumbnails: {
                150: item.node.thumbnail_resources[0].src,
                240: item.node.thumbnail_resources[1].src,
                320: item.node.thumbnail_resources[2].src,
                480: item.node.thumbnail_resources[3].src,
                640: item.node.thumbnail_resources[4].src,
            },
        });
    });
    return result;
}

const getIgColumn = (item) => `<div class="column is-4-desktop is-6-touch">
  <a href="${item.url}" target="_blank"><img src="${item.thumbnails['480']}" title="${item.caption}" /></a>
</div>`;

const container = document.querySelector('[data-instagram="true"]');

if (container.dataset.instagramid)
    getIgPosts('logan.chiro').then((data) => {
        for (let i = 0; i < 6; i++)
            container.insertAdjacentHTML('afterbegin', getIgColumn(data[i]));
    });

const videos = document.querySelectorAll('.custom-video');
videos.forEach((item) => {
    item.insertAdjacentHTML(
        'beforeend',
        `<div class="custom-video-button">
            <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="play"
                class="svg-inline--fa fa-play fa-w-14"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
            >
                <path
                    fill="#3fc1c9"
                    d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"
                ></path>
            </svg>
        </div>`,
    );

    const video = item.querySelector('video');
    const button = item.querySelector('.custom-video-button');

    button.addEventListener('click', () => {
        video.play();
        button.classList.add('is-hidden');

        video.onended = () => {
            button.classList.remove('is-hidden');
        };
    });
});

const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach((el) => {
        el.addEventListener('click', () => {
            const target = el.dataset.target;
            const $target = document.getElementById(target);

            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');
        });
    });
}
