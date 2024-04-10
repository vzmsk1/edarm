import Swiper from 'swiper';
import 'swiper/css';
import { remToPx } from '../utils/utils';
import { Navigation, Autoplay, Pagination, EffectFade, Thumbs } from 'swiper/modules';
import { gsap } from 'gsap';

window.addEventListener('load', function () {
    const mm = window.matchMedia('(max-width:768px)');
    const AUTOPLAY_DELAY = 4000;
    const tl = gsap.timeline();

    function startProgressbar() {
        tl.to('.swiper-navigation-hero__progressbar', {
            '--progress': 1,
            ease: 'linear',
            duration: AUTOPLAY_DELAY / 1000
        });
    }

    if (document.querySelector('.hero__swiper')) {
        new Swiper('.hero__swiper', {
            modules: [Navigation, Autoplay, Pagination, EffectFade],
            speed: 800,
            loop: true,
            effect: 'fade',
            fadeEffect: { crossFade: true },
            autoplay: {
                delay: AUTOPLAY_DELAY,
                disableOnInteraction: false
            },
            pagination: {
                el: '.hero__swiper-fraction',
                type: 'custom',
                renderCustom: function (swiper, current, total) {
                    const curr = current < 10 ? '0' + current : current;
                    const tot = total < 10 ? '0' + total : total;
                    return `<span class='swiper-pagination-custom__current h h_h3'>${curr}</span><span class='swiper-pagination-custom__divider'>/</span><span class='swiper-pagination-custom__total'>${tot}</span>`;
                }
            },
            navigation: {
                prevEl: '.swiper-navigation-hero .i-btn_prev',
                nextEl: '.swiper-navigation-hero .i-btn_next'
            },
            on: {
                afterInit: (swiper) => {
                    swiper.autoplay.stop();
                    setTimeout(() => {
                        swiper.autoplay.start();
                        startProgressbar();
                    }, 0);
                },
                realIndexChange: () => {
                    tl.progress(0);
                    setTimeout(() => {
                        startProgressbar();
                    }, 0);
                }
            }
        });
    }

    if (document.querySelector('.documentation__swiper')) {
        new Swiper('.documentation__swiper', {
            modules: [Navigation, Autoplay],
            speed: 800,
            loop: true,
            spaceBetween: remToPx(1.6),
            autoplay: {
                delay: AUTOPLAY_DELAY,
                disableOnInteraction: false
            },
            navigation: {
                prevEl: '.documentation__head .i-btn_prev',
                nextEl: '.documentation__head .i-btn_next'
            },
            breakpoints: {
                768: {
                    slidesPerView: 3
                }
            }
        });
    }

    if (document.querySelector('.product__swiper')) {
        const thumbs = new Swiper('.product__thumbs-swiper', {
            speed: 800,
            slidesPerView: 'auto',
            spaceBetween: remToPx(1.6),
            loop: true,
            breakpoints: {
                768: {
                    direction: 'vertical'
                }
            }
        });
        new Swiper('.product__swiper', {
            modules: [Thumbs],
            speed: 800,
            spaceBetween: remToPx(1.6),
            thumbs: {
                swiper: thumbs
            },
            loop: true
        });
    }

    if (document.querySelector('.collections__swiper')) {
        new Swiper('.collections__swiper', {
            modules: [Navigation, Autoplay],
            speed: 800,
            rewind: true,
            slidesPerView: 'auto',
            spaceBetween: remToPx(1.2),

            autoplay: {
                delay: AUTOPLAY_DELAY,
                disableOnInteraction: false
            },
            navigation: {
                prevEl: '.collections__head .i-btn_prev',
                nextEl: '.collections__head .i-btn_next'
            },
            breakpoints: {
                768: {
                    slidesPerView: 5,
                    spaceBetween: remToPx(1.6)
                }
            }
        });
    }

    function initSlidersOnResize() {
        if (document.querySelector('.services__swiper') && mm.matches) {
            let servicesSwiper = null;

            new Swiper('.services__swiper', {
                modules: [Navigation, Autoplay],
                speed: 800,
                rewind: true,
                spaceBetween: remToPx(1.2),

                autoplay: {
                    delay: AUTOPLAY_DELAY,
                    disableOnInteraction: false
                },
                navigation: {
                    prevEl: '.services__head .i-btn_prev',
                    nextEl: '.services__head .i-btn_next'
                },
                breakpoints: {
                    768: {
                        slidesPerView: 4,
                        enabled: false
                    }
                }
            });
        }
    }
    initSlidersOnResize();

    mm.addEventListener('change', function () {
        initSlidersOnResize();
    });
});
