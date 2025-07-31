import { useEffect, useState } from 'react';
import './SectorsElement.scss';
import { useNavigate } from 'react-router-dom';
import VideoFramePlayer from "../SubPageDecor/MiniBlockPlayer.jsx";

const config = {
    'Digital': {
        pathToFolder: 'sectorsSequences/DigitalNew/',
        frames: 96,
        src: 'video/sectors/Looped_Digital.mp4'
    },
    'Energy': {
        pathToFolder: 'sectorsSequences/Energy/',
        frames: 90,
        src: 'video/sectors/looped_Energy.mp4'
    },
    'Green': {
        pathToFolder: 'sectorsSequences/Green/',
        frames: 103,
        src: 'video/sectors/looped_Green_energy.mp4'
    },
    'RealEstate': {
        pathToFolder: 'sectorsSequences/RealEstate/',
        frames: 70,
        src: 'video/sectors/looped_real_estate.mp4'
    },
    'Telecom': {
        pathToFolder: 'sectorsSequences/Telecom/',
        frames: 97,
        src: 'video/sectors/looped_Telecom.mp4'

    },
    'Water': {
        pathToFolder: 'sectorsSequences/Water/',
        frames: 85,
        src: 'video/sectors/looped_Water.mp4'
    },
};

export default ({ seq, title, text, href, setcurrFrame = () => { }, setframesLoaded = () => { } }) => {
    const nav = useNavigate()

    const [currentFrame, setcurrentFrame] = useState(0);
    const [showPreview, setshowPreview] = useState(true);

    useEffect(() => {
        setcurrFrame(currentFrame)

        if (currentFrame === 0) {
            setshowPreview(true)
        } else {
            setshowPreview(false)
        }
    }, [currentFrame])


    return (
        <div className={`SectorsElement`} onClick={() => {
            nav(`/${href}`)
        }}>

            <div className={`SectorsElement_frameAndFade `}>
                <div className='SectorsElement_fade free_img'>
                    {/* <div className='SectorsElement_fade_inner'></div> */}
                </div>
                <div className='SectorsElement_content'>

                    <VideoFramePlayer
                      videoSrc={config[seq].src}
                      playType='fingerLoop'
                      withLight
                      rounded
                      setcurrFrame={setcurrentFrame}
                      setframesLoaded={setframesLoaded}
                    />
                </div>
                <div className='SectorsElement_fade SectorsElement_fade_right free_img'>
                    {/* <div className='SectorsElement_fade_inner'></div> */}
                </div>
            </div>

            <div className='SectorsElement_text'>
                <div className='SectorsElement_text_title '>
                    {title}
                </div>
                <div className='SectorsElement_text_text '>
                    {/* {text} */}
                    More
                </div>
                {/* <div className='SectorsElement_text_btn'>
                    <Link to={href} className='SectorsElement_text_btn_a'>
                        More
                    </Link>
                </div> */}
            </div>
        </div>
    )
}