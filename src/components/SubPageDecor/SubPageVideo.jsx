import './SubPageDecor.scss';
import { useEffect, useRef } from 'react';
import { mainPageStore } from '../../stores/mainPageStore';
import { observer } from 'mobx-react-lite';

export default observer(({ path, pathLoop }) => {
    const videoRef = useRef(null);
    const videoRefLoop = useRef(null);
    const canvasRef = useRef(null);
    const playingRef = useRef(false);

    const drawFrame = (video) => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    const playFrameByFrame = (from, to, forward = true, totalKP, fps = 30) => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        mainPageStore.slidePlaying = true

        if (!video || !ctx || !video.requestVideoFrameCallback) {
            console.warn('Video or context not ready');
            return;
        }

        console.log('▶️ playFrameByFrame:', { from, to, forward });

        const step = 1 / fps;
        let current = from;
        playingRef.current = true;

        const totalFrames = Math.floor(Math.abs(to - from) * fps);
        let frameIndex = 0;

        const drawLoopFrame = () => {
            const loopVideo = videoRefLoop.current;
            const ctx = canvasRef.current.getContext('2d');

            const draw = () => {
                if (!loopVideo.paused && !loopVideo.ended) {
                    ctx.drawImage(loopVideo, 0, 0, canvasRef.current.width, canvasRef.current.height);
                    requestAnimationFrame(draw);
                }
            };

            draw();
        };

        const renderNext = () => {
            if (!playingRef.current) return;

            const done = frameIndex >= totalFrames;
            if (done) {
                console.log('DONE');
                playingRef.current = false;
                mainPageStore.slidePlaying = false;
                if (totalKP - 1 === mainPageStore.currentSlide) {
                    mainPageStore.end()
                    videoRefLoop.current.play()
                    drawLoopFrame()
                }
                return;
            }

            const time = forward
              ? from + frameIndex * step
              : from - frameIndex * step;

            const onSeeked = () => {
                video.removeEventListener('seeked', onSeeked);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                frameIndex++;
                setTimeout(renderNext, 1000 / fps);
            };

            console.log(`video.currentTime: ${video.currentTime}`);

            video.addEventListener('seeked', onSeeked);
            video.currentTime = time;
        };

        const onStartSeeked = () => {
            video.removeEventListener('seeked', onStartSeeked);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            setTimeout(renderNext, 1000 / fps);
        };

        video.pause();
        video.addEventListener('seeked', onStartSeeked);
        video.currentTime = current;
    };

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        const onLoaded = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            drawFrame(video);
        };

        video.addEventListener('loadeddata', onLoaded);
        return () => video.removeEventListener('loadeddata', onLoaded);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        const loopVideo = videoRefLoop.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const hasScrolledRef = { current: false };

        if (!video || !loopVideo || !canvas || !ctx) return;

        const draw = () => {
            if (!video.ended) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                requestAnimationFrame(draw);
            }
        };

        const drawLoop = () => {
            if (!loopVideo.paused && !loopVideo.ended) {
                ctx.drawImage(loopVideo, 0, 0, canvas.width, canvas.height);
                requestAnimationFrame(drawLoop);
            }
        };

        const onScroll = () => {
            if (!hasScrolledRef.current) {
                hasScrolledRef.current = true;

                if (mainPageStore.isFirstVisit) {
                    video.play();
                    requestAnimationFrame(draw);
                } else {
                    loopVideo.play();
                    drawLoop();
                    mainPageStore.end();
                }

                window.removeEventListener('scroll', onScroll);
            }
        };

        const onEnd = () => {
            if (mainPageStore.isFirstVisit) {
                mainPageStore.setFirstVisitComplete();
            }
            mainPageStore.end();
            loopVideo.play();
            drawLoop();
        };

        video.addEventListener('ended', onEnd);
        video.addEventListener('loadeddata', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        });

        if (!mainPageStore.isFirstVisit) {
            loopVideo.addEventListener('loadeddata', () => {
                canvas.width = loopVideo.videoWidth;
                canvas.height = loopVideo.videoHeight;
                drawFrame(loopVideo);
                loopVideo.play();
                drawLoop();
            });
        }

        window.addEventListener('scroll', onScroll);

        return () => {
            video.removeEventListener('ended', onEnd);
            window.removeEventListener('scroll', onScroll);
        };
    }, [mainPageStore.isFirstVisit]);

    return (
      <div className='SubPageDecor'>
          <div className='RealEstate_hero_decor RealEstate_hero_decor_vid free_img' >
              <canvas ref={canvasRef} />
              <video
                ref={videoRef}
                src={path}
                muted
                preload='auto'
                playsInline
                style={{ display: 'none' }}
              />
              <video
                ref={videoRefLoop}
                src={pathLoop}
                muted
                preload='auto'
                playsInline
                loop
                style={{ display: 'none' }}
              />
          </div>
      </div>
    );
});