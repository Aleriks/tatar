import ScrollDown from '../../components/ScrollDown/ScrollDown';
import './AboutUs.scss';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import AboutUsKeypointsEl from './AboutUsKeypointsEl/AboutUsKeypointsEl';
import AboutUsTextEl from './AboutUsTextEl/AboutUsTextEl';

import { useTranslation } from 'react-i18next';
import Circle from './Circle';
import AboutUsMapDecorBlock from './AboutUsMapDecorBlock';
import PageHeader from '../../components/PageHeader/PageHeader';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default () => {
    const { t } = useTranslation();

    // const leftRef = useRef(null);
    // const rightRef = useRef(null);
    // const leftRef2 = useRef(null);
    // const rightRef2 = useRef(null);

    const els = t('aboutUs.els', { returnObjects: true });
    // const keypointsEl = t('aboutUs.keypointsEl', { returnObjects: true });
    const textEl = t('aboutUs.textEl', { returnObjects: true });
    const infoEl = t('aboutUs.infoEl', { returnObjects: true });

    const keypointsEl = [
        {
            city: 'München'
        },
        {
            city: 'New York'
        },
        {
            city: 'Hong Kong'
        },
        {
            city: 'Paderborn'
        },
        {
            city: 'Düsseldorf'
        },

    ]

    // useEffect(() => {
    //     const containers = containersRef.current.filter(Boolean);

    //     gsap.to(containers[0], {
    //         x: '25vw',
    //         scrollTrigger: {
    //             trigger: containers[0],
    //             start: 'top 70%',
    //             end: 'center center',
    //             scrub: true,
    //         }
    //     });

    //     gsap.to(containers[1], {
    //         x: '10vw',
    //         scrollTrigger: {
    //             trigger: containers[1],
    //             start: 'top bottom',
    //             end: 'center center',
    //             scrub: true,
    //         }
    //     });
    // }, []);


    const scope = useRef(null);
    useGSAP(() => {
        for (let i = 0; i < 3; i++) {
            gsap.fromTo(`.AboutUs_lines_container_${i}`, {
                x: -100,
                opacity: 0,
            }, {
                delay: i * .5,
                x: window.innerWidth > 700 ? 0 + i * 100 : 0,
                opacity: 1,
            })
        }


        const elements = document.querySelectorAll('.AboutUsTextEl');

        elements.forEach(el => {
            gsap.fromTo(el, {
                x: -100,
                opacity: 0,
            }, {
                x: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: el,
                    scrub: 1,
                    start: `0% 75%`,
                    end: `100% 75%`,
                },
            });
        });

    }, { scope: scope })

    // useEffect(() => {
    //     const left = leftRef.current;
    //     const right = rightRef.current;
    //     const left2 = leftRef2.current;
    //     const right2 = rightRef2.current;

    //     const tl = gsap.timeline({
    //         scrollTrigger: {
    //             trigger: '.AboutUs_unternehmen',
    //             start: 'top 30%',
    //             end: 'bottom bottom',
    //             toggleActions: 'play none none reverse',
    //         },
    //         defaults: { duration: 1, ease: 'power3.out' },
    //     });

    //     tl.from(left, { x: '-100%', opacity: 0 })
    //         .from(right, { x: '100%', opacity: 0 }, '-=0.8');

    //     tl.from(left2, { x: '-100%', opacity: 0 })
    //         .from(right2, { x: '100%', opacity: 0 }, '-=0.8');

    //     return () => {
    //         ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    //     };
    // }, []);

    return (
        <div className='AboutUs container' ref={scope}>
            <PageHeader text={t('aboutUs.hero_title')} />

            <div className='AboutUs_lines mt_xl'>
                {els.map((el, index) => (
                    <div className={`AboutUs_lines_wrapper ${index === 0 && 'AboutUs_lines_wrapper_first'}`} key={`AboutUs_lines_wrapper_${index}`}>
                        <div className="container">

                            <div className={`AboutUs_lines_container AboutUs_lines_container_${index}`}>
                                <div className='AboutUs_lines_container_title fs_2xl fsw_m'>{el.title}</div>
                                <div className='AboutUs_lines_container_content'>
                                    <div className='AboutUs_lines_container_content_text'>{el.text}</div>
                                    {el.country && (
                                        <div className='AboutUs_lines_container_content_text_country'>
                                            {el.country.map((country, idx) => (
                                                <div className='AboutUs_lines_container_content_text_country_el' key={`country_${idx}`}>
                                                    {country}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='AboutUs_map mt_xl'>
                <div className='AboutUs_map_world free_img'>
                    {/* <img src="/mapBlack.svg" className='AboutUs_map_world' alt="" /> */}
                    {/* <img src="/bigMap.webp" className='AboutUs_map_world' alt="" /> */}
                    <img src="/worldMap2.webp" className='AboutUs_map_world' alt="" />
                </div>
                <AboutUsMapDecorBlock config={{
                    city: 'New York',
                    country: 'USA',
                    address: 'Address',
                    video: '/video/map/Padderborn.mp4',
                    endImage: '/img/map/1.webp',
                    mode: 'end-image',
                    position: {
                        x: -.43,
                        y: 0.01,
                    }
                }} />
                <AboutUsMapDecorBlock config={{
                    city: 'Düsseldorf',
                    country: 'Germany',
                    address: 'Address',
                    video: '/video/map/Dusseldorf.mp4',
                    endImage: '/img/map/2.webp',
                    textPos: 'left',
                    mode: 'end-image',  // или 'end-image'
                    position: {
                        x: -.055,
                        y: -.095,
                    }
                }} />
                <AboutUsMapDecorBlock config={{
                    city: 'Paderborn',
                    country: 'Germany',
                    address: 'Address',
                    video: '/video/map/Padderborn.mp4',
                    endImage: '/img/map/3.webp',
                    textPos: 'center',
                    mode: 'end-image',  // или 'end-image'
                    position: {
                        x: -.043,
                        y: -.105,
                    }
                }} />
                <AboutUsMapDecorBlock config={{
                    city: 'Munich',
                    country: 'Germany',
                    address: 'Address',
                    video: '/video/map/Munich.mp4',
                    endImage: '/img/map/4.webp',
                    mode: 'end-image',  // или 'end-image'
                    position: {
                        x: -.035,
                        y: -.063,
                    }
                }} />
                <AboutUsMapDecorBlock config={{
                    city: 'Hong Kong',
                    country: '',
                    address: 'Address',
                    video: '/video/map/Padderborn.mp4',
                    endImage: '/img/map/5.webp',
                    mode: 'end-image',
                    textPos: 'left',
                    position: {
                        x: .455,
                        y: .165,
                    }
                }} />
            </div>

            <div className='AboutUs_keypoints mt_xl'>
                <div className='AboutUs_keypoints_title fs_2xl fsw_m'>{t('aboutUs.keypoints_title')}</div>
                <div className='AboutUs_keypoints_content'>
                    {keypointsEl.map((el, index) => (
                        <AboutUsKeypointsEl title={el.city} text={'Mehr'} img={`/img/keypoints/${index + 1}.webp`} key={`AboutUsKeypointsEl_${index}`} />
                    ))}
                </div>
            </div>

            <div className='AboutUs_unternehmen mt_xl'>
                <div className='AboutUs_unternehmen_title fsw_m fs_2xl'>
                    {t('aboutUs.unternehmen_title')}
                </div>
                <div className='AboutUs_unternehmen_content'>
                    <div className='AboutUs_unternehmen_content_left' >
                        {textEl.map((el, index) => (
                            <AboutUsTextEl index={index} title={el.title} text={el.text} width key={`AboutUsTextEl_${index}`} />
                        ))}
                    </div>
                    <div className='AboutUs_unternehmen_content_right'>
                        <img src="/img/street.webp" alt="" />
                    </div>
                </div>
            </div>

            <div className='AboutUs_text mt_xl'>
                <div className='AboutUs_text_container'>
                    <div className='AboutUs_text_container_top'>
                        {infoEl.slice(0, 3).map((el, index) => (
                            <AboutUsTextEl title={el.title} text={el.text} small key={`AboutUs_text_container_top_${index}`} />
                        ))}
                    </div>
                    <div className='AboutUs_text_container_bottom'>
                        {infoEl.slice(3, 5).map((el, index) => (
                            <AboutUsTextEl title={el.title} text={el.text} width key={`AboutUs_text_container_bottom_${index}`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
