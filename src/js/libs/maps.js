import { modules } from '../modules';
import { _slideDown, _slideUp, removeClasses } from '../utils/utils';

export const markersCollection = [
    {
        coordinate: [27.62294616046451, 53.91147119117131],
        idx: 0
    },
    {
        coordinate: [27.378241398466194, 53.936583441243414],
        idx: 1
    }
];

async function initMap() {
    await ymaps3.ready;
    const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker, YMapCenterLocation } = ymaps3;
    const map = new YMap(document.getElementById('contactsMap'), {
        location: {
            center: [27.559646862734354, 53.901707367336755],
            zoom: 11
        },
        behaviors: ['drag']
    });

    modules.map = map;

    map.addChild(new YMapDefaultSchemeLayer());
    map.addChild(new YMapDefaultFeaturesLayer({ zIndex: 1800 }));

    const items = document.querySelectorAll(`[data-accordion-tabs="map"] [data-accordion-tabs-item]`);
    const contentItems = document.querySelectorAll(
        `[data-accordion-tabs="map"] [data-accordion-tabs-content]`
    );

    document.getElementById('contactsMap').addEventListener('click', function (e) {
        if (e.target.closest('.marker')) {
            removeClasses(document.querySelectorAll('.marker'), '_is-active');
            e.target.closest('.marker').classList.add('_is-active');

            map.setLocation({
                center: markersCollection.find((el) => el.idx === +e.target.closest('.marker').dataset.index)
                    .coordinate,
                duration: 300
            });

            const idx = e.target.closest('.marker').dataset.index;
            const item = items[idx];
            const content = contentItems[idx];

            if (item && content && !content.classList.contains('_is-active')) {
                removeClasses(items, '_is-active');
                removeClasses(contentItems, '_is-active');
                item.classList.add('_is-active');
                content.classList.add('_is-active');

                if (window.innerWidth <= 768 || !content.closest('[data-accordion-tabs-mm]')) {
                    contentItems.forEach((contentItem) => {
                        if (contentItem !== content) {
                            _slideUp(contentItem);
                        }
                    });
                    _slideDown(content);
                }
            }
        }
    });

    markersCollection.forEach((el) => {
        let content = document.createElement('div');
        content.dataset.index = el.idx;
        content.classList.add('marker', el.type);
        content.insertAdjacentHTML(
            'beforeend',
            `
										<svg width="162" height="83" viewBox="0 0 162 83" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="161.943" height="71.665" fill="#A6BDD0"/>
                    <path d="M21.6161 33.5283C26.4406 26.129 35.9541 25.8123 40.7434 32.8022C42.2478 34.998 42.8514 37.7469 42.5137 40.9997C38.4559 40.9997 34.3873 40.9997 30.2151 40.9997C30.1234 40.5671 29.9802 40.1025 29.932 39.6274C29.716 37.495 30.1259 37.0223 32.1351 37.0223C32.8647 37.0222 33.5944 37.0223 34.3796 37.0223C34.2915 35.8443 33.7567 35.1124 32.7689 34.7565C31.7175 34.3777 30.73 34.5299 29.8619 35.2763C27.7894 37.0584 27.7289 41.7583 29.746 43.5972C30.9594 44.7034 32.206 44.5961 34.0357 43.1376C35.5381 45.0171 37.0469 46.9045 38.5531 48.7889C35.4305 52.3795 28.8193 52.6452 24.5496 49.3775C19.8903 45.8115 18.6248 39.1005 21.6161 33.5283Z" fill="white"/>
                    <path d="M46.7719 45.2402C43.7012 37.9741 46.9117 30.2098 53.8403 28.2143C55.4015 27.7647 57.106 27.8623 58.8403 27.699C58.8403 31.1016 58.8403 34.0999 58.8403 37.2584C57.6025 36.3636 56.4008 36.0939 55.1997 37.0114C54.1367 37.8234 53.6969 38.9463 53.847 40.3182C54.0173 41.8739 55.2969 43.1394 56.7827 43.226C58.3824 43.3192 59.5162 42.475 59.8646 40.7945C60.0457 39.9207 60.1093 39.0053 60.1124 38.1083C60.133 32.1039 60.1231 26.0993 60.1231 20C62.8379 20 65.4873 20 68.2306 20C68.2595 20.236 68.3271 20.5322 68.3274 20.8285C68.3337 26.7935 68.3657 32.7588 68.3206 38.7234C68.2894 42.8573 67.2701 46.5986 63.9189 49.2037C58.2035 53.6469 50.67 51.9256 46.7719 45.2402Z" fill="white"/>
                    <path d="M81.9661 43.1999C82.9043 43.1266 83.7405 43.0277 84.6009 42.9259C84.6009 45.6419 84.6009 48.4742 84.6009 51.426C81.5928 52.0588 78.8454 51.4192 76.3619 49.7006C71.923 46.6289 70.174 40.5095 72.1509 35.3306C74.1695 30.0424 79.4056 26.9569 84.7258 27.9203C90.7783 29.0163 94.1383 33.1704 94.1601 39.6086C94.1729 43.3935 94.1624 47.1784 94.1624 51.041C91.4253 51.041 88.7814 51.041 85.9948 51.041C85.9948 48.3624 85.998 45.7106 85.9931 43.0588C85.9913 42.0656 86.0089 41.07 85.951 40.0798C85.8262 37.945 84.7525 36.6012 83.1302 36.4769C81.6666 36.3648 80.2066 37.4382 79.7993 38.9258C79.3009 40.7459 80.0633 42.3146 81.9661 43.1999Z" fill="white"/>
                    <path d="M105.332 50.1021C105.332 50.6817 105.332 51.1289 105.332 51.6649C102.627 51.6649 99.9777 51.6649 97.1688 51.6649C97.1688 50.5733 97.1628 49.4581 97.1699 48.3431C97.1918 44.9104 97.1053 41.4718 97.2676 38.0463C97.5909 31.2288 102.65 27.2943 109.05 28.8088C109.05 31.72 109.05 34.6451 109.05 37.6811C108.728 37.5951 108.455 37.5151 108.18 37.4506C106.904 37.1516 105.97 37.6827 105.608 39.0251C105.424 39.7092 105.351 40.4454 105.344 41.1593C105.316 44.0958 105.332 47.0329 105.332 50.1021Z" fill="white"/>
                    <path d="M112.051 42.4437C112.089 40.3226 112.001 38.3235 112.194 36.3547C112.546 32.763 114.434 30.2252 117.614 28.9142C120.807 27.5976 123.679 28.468 126.21 30.7856C126.467 31.0212 126.717 31.2657 127.003 31.5367C127.694 30.9809 128.339 30.4035 129.038 29.9104C134.192 26.2742 140.831 29.2796 141.648 35.7306C141.981 38.3551 141.882 41.0438 141.922 43.7042C141.963 46.3126 141.931 48.9223 141.931 51.6115C141.577 51.6339 141.33 51.6626 141.083 51.6629C138.679 51.6663 136.275 51.665 133.721 51.665C133.721 49.4174 133.721 47.2645 133.721 45.1117C133.721 42.988 133.743 40.8639 133.709 38.7408C133.695 37.8445 133.712 36.7671 132.473 36.7755C131.315 36.7833 131.139 37.8133 131.129 38.7147C131.084 42.7355 131.104 46.7571 131.1 50.7785C131.1 51.0031 131.1 51.2277 131.1 51.5588C128.389 51.5588 125.712 51.5588 122.907 51.5588C122.907 48.7022 122.911 45.8671 122.905 43.0319C122.902 41.4961 122.904 39.9597 122.86 38.4249C122.837 37.6245 122.662 36.8311 121.702 36.7659C120.665 36.6956 120.439 37.5339 120.303 38.3581C120.223 38.8425 120.247 39.3484 120.246 39.8446C120.242 43.7248 120.244 47.605 120.244 51.575C117.531 51.575 114.881 51.575 112.051 51.575C112.051 48.5978 112.051 45.5885 112.051 42.4437Z" fill="white"/>
                    <path id='path-rect' d="M80.9707 82.665L67.9707 71.665L93.9707 71.665L80.9707 82.665Z" fill="#A6BDD0"/>
                    </svg>
                  `
        );
        const marker = new YMapMarker({ coordinates: el.coordinate, draggable: false }, content);
        map.addChild(marker);
    });

    document.querySelector('.marker[data-index="0"]') &&
        document.querySelector('.marker[data-index="0"]').classList.add('_is-active');
}

if (document.getElementById('contactsMap')) {
    initMap();
}
