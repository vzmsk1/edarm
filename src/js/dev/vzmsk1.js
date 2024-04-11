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
                            // text.innerHTML = 'Файл должен иметь формат jpeg,jpg,png,webp, или pdf';
                            return;
                        } else {
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
