import { _slideDown, _slideToggle, _slideUp, removeClasses } from '../utils/utils';

document.addEventListener('DOMContentLoaded', function () {
    const mm = window.matchMedia('(max-width:768px)');

    function initTabsOnResize() {
        if (document.querySelectorAll('.accordion-product__content').length) {
            const items = document.querySelectorAll('.accordion-product__content');
            const containers = document.querySelectorAll('.accordion-product__item');

            if (!mm.matches) {
                items[0].classList.add('_is-active');
            } else {
                removeClasses(items, '_is-active');
                removeClasses(containers, '_is-active');
                _slideDown(items[0]);
            }

            containers[0].classList.add('_is-active');

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const container = containers[i];

                if (mm.matches) {
                    container.append(item);
                    if (i !== 0) _slideUp(item);
                } else {
                    document.querySelector('.accordion-product__container').append(item);
                }

                container.addEventListener('click', function () {
                    if (!mm.matches) {
                        removeClasses(items, '_is-active');
                        removeClasses(containers, '_is-active');
                        item.classList.add('_is-active');
                        container.classList.add('_is-active');
                    } else {
                        if (container.classList.contains('_is-active')) {
                            container.classList.remove('_is-active');
                            _slideUp(item);
                        } else {
                            container.classList.add('_is-active');
                            _slideDown(item);
                        }
                    }
                });
            }
        }
    }
    initTabsOnResize();

    mm.addEventListener('change', function () {
        initTabsOnResize();
    });
});
