'use strict';

function getIgPosts(user) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        var url = 'https://www.instagram.com/' + user + '/?__a=1';

        xhr.open('GET', url);
        xhr.onload = function () {
            return resolve(formatIgPosts(xhr.responseText));
        };
        xhr.onerror = function () {
            return reject(xhr.statusText);
        };
        xhr.send();
    });
}

function formatIgPosts(rawPosts) {
    var result = [];
    rawPosts = JSON.parse(rawPosts).graphql.user.edge_owner_to_timeline_media.edges;
    rawPosts.forEach(function (item) {
        if (typeof item.node.edge_media_to_caption.edges[0] != 'undefined') var caption = item.node.edge_media_to_caption.edges[0].node.text;else {
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
                640: item.node.thumbnail_resources[4].src
            }
        });
    });
    return result;
}

var getIgColumn = function getIgColumn(item) {
    return '<div class="column is-4-desktop is-6-touch">\n  <a href="' + item.url + '" target="_blank"><img src="' + item.thumbnails['480'] + '" title="' + item.caption + '" /></a>\n</div>';
};

var container = document.querySelector('[data-instagram="true"]');

if (container.dataset.instagramid) getIgPosts('logan.chiro').then(function (data) {
    for (var i = 0; i < 6; i++) {
        container.insertAdjacentHTML('afterbegin', getIgColumn(data[i]));
    }
});

var videos = document.querySelectorAll('.custom-video');
videos.forEach(function (item) {
    item.insertAdjacentHTML('beforeend', '<div class="custom-video-button">\n            <svg\n                aria-hidden="true"\n                focusable="false"\n                data-prefix="fas"\n                data-icon="play"\n                class="svg-inline--fa fa-play fa-w-14"\n                role="img"\n                xmlns="http://www.w3.org/2000/svg"\n                viewBox="0 0 448 512"\n            >\n                <path\n                    fill="#3fc1c9"\n                    d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"\n                ></path>\n            </svg>\n        </div>');

    var video = item.querySelector('video');
    var button = item.querySelector('.custom-video-button');

    button.addEventListener('click', function () {
        video.play();
        button.classList.add('is-hidden');

        video.onended = function () {
            button.classList.remove('is-hidden');
        };
    });
});

var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach(function (el) {
        el.addEventListener('click', function () {
            var target = el.dataset.target;
            var $target = document.getElementById(target);

            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');
        });
    });
}