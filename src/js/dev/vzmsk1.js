import { markersCollection } from '../libs/maps';
import { modules } from '../modules';
import { _slideDown, _slideToggle, _slideUp, removeClasses } from '../utils/utils';

document.addEventListener('DOMContentLoaded', function () {
    const mm = window.matchMedia('(max-width:768px)');

    function initTabsOnResize() {
        if (document.querySelectorAll('[data-accordion-tabs]').length) {
            document.querySelectorAll('[data-accordion-tabs]').forEach((block) => {
                const items = block.querySelectorAll('[data-accordion-tabs-content]');
                const containers = block.querySelectorAll('[data-accordion-tabs-item]');
                const body = block.querySelector('[data-accordion-tabs-body]');

                if (!mm.matches) {
                    items[0].classList.add('_is-active');
                } else {
                    removeClasses(items, '_is-active');
                    removeClasses(containers, '_is-active');
                    _slideDown(items[0]);
                }

                containers[0].classList.add('_is-active');

                function setMarkerActiveState(i, markers) {
                    if (document.querySelector(`.marker[data-index="${i}"]`)) {
                        const curMarker = document.querySelector(`.marker[data-index="${i}"]`);
                        removeClasses(markers, '_is-active');
                        curMarker.classList.add('_is-active');

                        modules.map.setLocation({
                            center: markersCollection.find((el) => el.idx === +curMarker.dataset.index)
                                .coordinate,
                            duration: 300
                        });
                    }
                }

                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const container = containers[i];

                    if (mm.matches) {
                        container.append(item);
                        if (i !== 0) _slideUp(item);
                    } else if (body) {
                        body.append(item);
                    }

                    container.addEventListener('click', function () {
                        const markers = Array.from(document.querySelectorAll('.marker'));

                        if (
                            mm.matches ||
                            (!block.hasAttribute('data-accordion-tabs-mm') &&
                                block.dataset.accordionTabs === 'map')
                        ) {
                            container.classList.toggle('_is-active');
                            item.classList.toggle('_is-active');

                            const activeItems = Array.from(
                                block.querySelectorAll('[data-accordion-tabs-item]._is-active')
                            );

                            if (activeItems.length > 1) {
                                activeItems.forEach((el) => {
                                    if (el !== container) {
                                        _slideUp(el.querySelector('[data-accordion-tabs-content]'));
                                        el.classList.remove('_is-active');
                                    }
                                });
                            } else if (!activeItems.length && markers.length) {
                                removeClasses(markers, '_is-active');
                            }

                            _slideToggle(item);

                            if (activeItems.length) {
                                setMarkerActiveState(i, markers);
                            }
                        } else {
                            removeClasses(items, '_is-active');
                            removeClasses(containers, '_is-active');
                            item.classList.add('_is-active');
                            container.classList.add('_is-active');

                            if (block.dataset.accordionTabs === 'map') {
                                setMarkerActiveState(i, markers);
                            }
                        }
                    });
                }
            });
        }
    }
    initTabsOnResize();

    function initFileReader() {
        if (document.querySelectorAll('.input_file').length) {
            const reader = new FileReader();

            document.querySelectorAll('.input_file input').forEach((input) => {
                reader.onload = function (e) {
                    // const maxSize = Number(input.dataset.fileInput);
                    const file = input.files[0];
                    const removeBtn = input.parentElement.querySelector('.input__remove-btn');

                    if (file) {
                        const data = {
                            name: file.name.split('.').slice(0, -1).join(''),
                            size: file.size,
                            extension: file.name.split('.').pop()
                        };
                        const extensions = ['jpeg', 'jpg', 'png', 'webp', 'pdf', 'doc'];

                        function formatBytes(bytes, decimals = 2) {
                            if (!+bytes) return '0 Bytes';

                            const k = 1024;
                            const dm = decimals < 0 ? 0 : decimals;
                            const sizes = ['b', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'];

                            const i = Math.floor(Math.log(bytes) / Math.log(k));

                            return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
                        }

                        // if ((data.size / 1048576).toFixed(2) > maxSize) {
                        // text.innerHTML = 'Большой размер файла';
                        if (!extensions.includes(data.extension)) {
                            input.closest('.input').classList.add('_has-error');
                            input.nextElementSibling.innerHTML =
                                'Файл должен иметь формат jpeg,jpg,png,webp,doc или pdf';
                            return;
                        } else {
                            input.closest('.input').classList.remove('_has-error');
                            input.closest('.input').classList.add('_is-filled');

                            if (input.nextElementSibling) {
                                input.nextElementSibling.innerHTML = data.name;
                                input.parentElement.dataset.size = formatBytes(data.size, 0);
                            }
                        }

                        if (removeBtn) {
                            removeBtn.addEventListener('click', function () {
                                input.parentElement.classList.remove('_is-filled');
                                input.nextElementSibling.innerHTML = 'Прикрепить файл';
                                input.parentElement.dataset.size = '';
                                input.value = '';
                            });
                        }
                    }
                };
                input.addEventListener('change', function () {
                    if (input.files[0]) reader.readAsDataURL(input.files[0]);
                });
            });
        }
    }
    initFileReader();

    mm.addEventListener('change', function () {
        initTabsOnResize();
    });
});
