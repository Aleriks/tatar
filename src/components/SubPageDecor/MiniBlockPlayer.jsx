import { observer } from 'mobx-react-lite';
import './SubPageDecor.scss';
import { useEffect, useRef, useState } from 'react';

const VideoFramePlayer = ({
                            videoSrc,
                            playType = 'fingerLoop',
                            withLight = false,
                            rounded = false,
                            setcurrFrame = () => {},
                            setframesLoaded = () => {}
                          }) => {
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [boxShadow, setBoxShadow] = useState(0);
  const animationFrameRef = useRef(null);
  const isPlayingForward = useRef(false);
  const isPlayingBackward = useRef(false);

  // Конвертация значения в hex для прозрачности
  const toHexAlpha = (value) => {
    const clamped = Math.max(0, Math.min(1, value));
    const intVal = Math.round(clamped * 255);
    return intVal.toString(16).padStart(2, '0');
  };

  /** video init **/
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setLoaded(true);
      setframesLoaded(true);
      video.currentTime = 0;
    };

    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [setframesLoaded]);

  /** sync decor **/
  const updateProgress = () => {
    const video = videoRef.current;
    if (!video) return;

    const progress = video.currentTime / video.duration;
    setBoxShadow(progress);

    /** sync current frame **/
    const currentFrame = Math.floor(progress * 60);
    setcurrFrame(currentFrame);
  };

  const playForward = () => {
    const video = videoRef.current;
    if (!video || !loaded) return;

    isPlayingForward.current = true;
    isPlayingBackward.current = false;

    video.playbackRate = 1;
    video.play();

    const animate = () => {
      if (!isPlayingForward.current) return;

      updateProgress();

      if (video.currentTime >= video.duration) {
        video.pause();
        isPlayingForward.current = false;
        return;
      }

      /** timeupdate **/
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (video.requestVideoFrameCallback) {
      const videoFrameCallback = () => {
        if (!isPlayingForward.current) return;
        updateProgress();
        if (video.currentTime < video.duration) {
          video.requestVideoFrameCallback(videoFrameCallback);
        } else {
          isPlayingForward.current = false;
        }
      };
      video.requestVideoFrameCallback(videoFrameCallback);
    } else {
      animate();
    }
  };

  const playBackward = () => {
    const video = videoRef.current;
    if (!video || !loaded) return;

    isPlayingForward.current = false;
    isPlayingBackward.current = true;

    const fps = 60;
    const frameTime = 1 / fps;
    let lastTime = performance.now();

    const animate = (currentTime) => {
      if (!isPlayingBackward.current) return;

      const deltaTime = (currentTime - lastTime) / 1000; // конвертируем в секунды

      if (deltaTime >= frameTime) {
        video.currentTime = Math.max(0, video.currentTime - frameTime);
        updateProgress();
        lastTime = currentTime;

        if (video.currentTime <= 0) {
          video.pause();
          isPlayingBackward.current = false;
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const stopPlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    isPlayingForward.current = false;
    isPlayingBackward.current = false;
    video.pause();

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handlePointerEnter = () => {
    if (playType === 'autoLoop') return;

    console.log('video enter');
    setIsHovered(true);
    playForward();
  };

  const handlePointerLeave = () => {
    if (playType === 'autoLoop') return;

    console.log('video leave');
    setIsHovered(false);
    stopPlayback();
    playBackward();
  };

  return (
    <div className="video-frame-player">
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{
          opacity: loaded ? 1 : 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          userSelect: 'none',
          pointerEvents: playType === 'triggerLoop' ? 'none' : 'all',
          boxShadow: withLight ? `0px 0px 45px #ffffff${toHexAlpha(boxShadow)}` : 'none',
        }}
        draggable={false}
        className={`${rounded ? 'framePlayerImg_rounded' : ''} framePlayerImg`}
      />
    </div>
  );
};

export default observer(VideoFramePlayer);