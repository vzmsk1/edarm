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
										<svg width="90" height="69" viewBox="0 0 90 69" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_f_4217_10971)">
                    <ellipse cx="44.5" cy="51" rx="18.5" ry="4" fill="#001B30"/>
                    </g>
                    <rect width="90" height="40" fill="#A6BDD0"/>
                    <path d="M11.8879 18.7143C14.5793 14.5864 19.8867 14.4097 22.5585 18.3092C23.3977 19.5342 23.7345 21.0677 23.5461 22.8824C21.2824 22.8824 19.0126 22.8824 16.685 22.8824C16.6339 22.641 16.554 22.3819 16.5271 22.1168C16.4066 20.9272 16.6353 20.6635 17.7561 20.6635C18.1632 20.6635 18.5703 20.6635 19.0083 20.6635C18.9591 20.0063 18.6608 19.598 18.1097 19.3995C17.5232 19.1882 16.9723 19.2731 16.488 19.6895C15.3318 20.6836 15.298 23.3056 16.4233 24.3314C17.1003 24.9486 17.7957 24.8887 18.8164 24.075C19.6546 25.1236 20.4963 26.1765 21.3366 27.2277C19.5946 29.2308 15.9064 29.3791 13.5244 27.5561C10.9251 25.5668 10.2191 21.8229 11.8879 18.7143Z" fill="white"/>
                    <path d="M25.9203 25.2482C24.2072 21.1947 25.9982 16.8632 29.8635 15.75C30.7345 15.4992 31.6853 15.5536 32.6529 15.4625C32.6529 17.3607 32.6529 19.0334 32.6529 20.7955C31.9623 20.2963 31.2919 20.1458 30.6219 20.6576C30.0288 21.1106 29.7835 21.7371 29.8673 22.5024C29.9622 23.3703 30.6761 24.0763 31.505 24.1246C32.3974 24.1766 33.0299 23.7056 33.2243 22.7681C33.3253 22.2807 33.3608 21.77 33.3625 21.2696C33.3741 17.9199 33.3685 14.5701 33.3685 11.1675C34.883 11.1675 36.3611 11.1675 37.8915 11.1675C37.9076 11.2991 37.9453 11.4644 37.9455 11.6297C37.9489 14.9574 37.9668 18.2852 37.9417 21.6127C37.9243 23.9189 37.3556 26.0061 35.4861 27.4594C32.2976 29.9381 28.0949 28.9779 25.9203 25.2482Z" fill="white"/>
                    <path d="M45.5548 24.11C46.0782 24.0692 46.5447 24.014 47.0247 23.9572C47.0247 25.4724 47.0247 27.0524 47.0247 28.6992C45.3466 29.0522 43.8139 28.6954 42.4284 27.7366C39.9521 26.023 38.9764 22.6091 40.0792 19.72C41.2053 16.7699 44.1264 15.0485 47.0944 15.586C50.4709 16.1974 52.3453 18.5149 52.3575 22.1066C52.3647 24.2181 52.3588 26.3296 52.3588 28.4844C50.8318 28.4844 49.3569 28.4844 47.8023 28.4844C47.8023 26.9901 47.8041 25.5107 47.8014 24.0314C47.8004 23.4773 47.8102 22.9219 47.7779 22.3694C47.7083 21.1785 47.1092 20.4288 46.2042 20.3595C45.3877 20.297 44.5733 20.8958 44.346 21.7257C44.068 22.7411 44.4933 23.6162 45.5548 24.11Z" fill="white"/>
                    <path d="M58.5909 27.9605C58.5909 28.2838 58.5909 28.5333 58.5909 28.8323C57.0815 28.8323 55.6037 28.8323 54.0367 28.8323C54.0367 28.2233 54.0334 27.6012 54.0373 26.9792C54.0496 25.0642 54.0013 23.1459 54.0919 21.2349C54.2722 17.4316 57.0943 15.2367 60.665 16.0815C60.665 17.7056 60.665 19.3374 60.665 21.0311C60.485 20.9832 60.3332 20.9385 60.1796 20.9025C59.4678 20.7357 58.9465 21.032 58.7449 21.7809C58.6421 22.1625 58.6013 22.5733 58.5975 22.9715C58.5817 24.6097 58.5909 26.2482 58.5909 27.9605Z" fill="white"/>
                    <path d="M62.3379 23.6879C62.3595 22.5047 62.3104 21.3894 62.4179 20.2911C62.6142 18.2874 63.6673 16.8716 65.4412 16.1402C67.2226 15.4057 68.8249 15.8913 70.2367 17.1842C70.3803 17.3157 70.5197 17.4521 70.6791 17.6032C71.0649 17.2932 71.4246 16.9711 71.8146 16.696C74.6899 14.6674 78.3933 16.3441 78.8495 19.9429C79.0351 21.4071 78.9796 22.907 79.0024 24.3911C79.0248 25.8463 79.0073 27.3022 79.0073 28.8024C78.8096 28.8149 78.6719 28.8309 78.5341 28.8311C77.1929 28.833 75.8517 28.8322 74.4273 28.8322C74.4273 27.5784 74.4274 26.3774 74.4272 25.1763C74.4271 23.9916 74.4395 22.8066 74.4206 21.6222C74.4126 21.1222 74.4219 20.5211 73.7311 20.5258C73.0848 20.5302 72.9868 21.1048 72.9812 21.6077C72.956 23.8508 72.9669 26.0943 72.9648 28.3377C72.9647 28.463 72.9648 28.5883 72.9648 28.773C71.4526 28.773 69.9588 28.773 68.3941 28.773C68.3941 27.1794 68.3964 25.5977 68.3932 24.0161C68.3914 23.1593 68.3924 22.3022 68.3681 21.446C68.3554 20.9994 68.2578 20.5569 67.722 20.5205C67.1435 20.4812 67.0177 20.9489 66.9415 21.4087C66.8967 21.679 66.9102 21.9612 66.9099 22.238C66.9078 24.4027 66.9087 26.5673 66.9087 28.782C65.395 28.782 63.917 28.782 62.3379 28.782C62.3379 27.1211 62.3379 25.4424 62.3379 23.6879Z" fill="white"/>
                    <path d="M45 51L32 40L58 40L45 51Z" fill="#A6BDD0"/>
                    <defs>
                    <filter id="filter0_f_4217_10971" x="12" y="33" width="65" height="36" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feGaussianBlur stdDeviation="7" result="effect1_foregroundBlur_4217_10971"/>
                    </filter>
                    </defs>
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
