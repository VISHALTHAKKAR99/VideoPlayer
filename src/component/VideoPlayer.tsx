import React, { useState, useRef, useEffect } from 'react';
import VideoUrlInput from './VideoURLInput';
import CaptionInput from './CaptionInput';
import VideoDisplay from './VideoDisplay';
import CaptionDisplay from './CaptionDisplay';
import PlayPauseButton from './PlayPauseButton';
interface Caption {
    timestamp: string; // e.g., "00:01:30" (hh:mm:ss)
    text: string;
  }
const VideoPlayer: React.FC = () => {
  // ...state management and logic ...
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>('');
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);
  const [isValidCaption, setIsValidCaption] = useState<boolean | null>(null);
  const [isValidTimestamp, setIsValidTimestamp] = useState<boolean | null>(null);
  const [videoType, setVideoType] = useState<'mp4' | 'youtube' | 'invalid' | null>(null);
  const [captionToDisplay, setCaptionToDisplay] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const youtubePlayerRef = useRef<any>(null); // Reference for YouTube player
  const videoRef = useRef<HTMLVideoElement>(null); // For MP4 videos

  // Handlers for form inputs
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value);
  };

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimestamp(e.target.value);
  };

  const validateUrl = (url: string): 'mp4' | 'youtube' | 'invalid' => {
    const mp4Regex = /^(https?:\/\/(?:www\.)?[^/]+(?:\/[^/]+)*\.mp4)$/i;
    const youtubeRegex =
      /^(https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.*|(?:v|e(?:mbed)?)\/?([\w\-]+))|youtu\.be\/([\w\-]+))(\?[^#]*)?)$/i;

    if (mp4Regex.test(url)) {
      return 'mp4';
    }
    if (youtubeRegex.test(url)) {
      return 'youtube';
    }
    return 'invalid';
  };

  const validateTimestamp = (timestamp: string): boolean => {
    const regex = /^([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
    return regex.test(timestamp);
  };

  const validateCaption = (caption: string): boolean => {
    return caption.trim() !== ''; // Caption should not be empty
  };

  const handleAddCaption = (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validate the timestamp and caption
    const isTimestampValid = validateTimestamp(timestamp);
    const isCaptionValid = validateCaption(caption);
  
    setIsValidTimestamp(isTimestampValid);
    setIsValidCaption(isCaptionValid);
  
    // Only add the caption if both the timestamp and caption are valid
    if (isTimestampValid && isCaptionValid) {
      const newCaption: Caption = { timestamp, text: caption };
  
      setCaptions((prevCaptions) => {
        const updatedCaptions = [...prevCaptions, newCaption];
        return updatedCaptions;
      });
  
      setTimestamp('');
      setCaption('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const urlType = validateUrl(videoUrl);
    setIsValidUrl(urlType !== 'invalid');
    setVideoType(urlType);
  };

  // Check captions based on current time of the video
  const checkCaptionsAtTime = () => {
    if (videoType === 'mp4' && videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      let captionFound = false;
  
      for (let caption of captions) {
        const [hours, minutes, seconds] = caption.timestamp.split(':').map(Number);
        const timestampInSeconds = hours * 3600 + minutes * 60 + seconds;
        if (Math.abs(currentTime - timestampInSeconds) < 0.5) {
          setCaptionToDisplay(caption.text);
          captionFound = true;
          break;
        }
      }
  
      if (!captionFound) {
        setCaptionToDisplay('');
      }
    } else if (videoType === 'youtube' && youtubePlayerRef.current) {
      const currentTime = youtubePlayerRef.current.getCurrentTime();
      let captionFound = false;
  
      for (let caption of captions) {
        const [hours, minutes, seconds] = caption.timestamp.split(':').map(Number);
        const timestampInSeconds = hours * 3600 + minutes * 60 + seconds;
        if (Math.abs(currentTime - timestampInSeconds) < 0.5) {
          setCaptionToDisplay(caption.text);
          captionFound = true;
          break;
        }
      }
  
      if (!captionFound) {
        setCaptionToDisplay('');
      }
    }
  };

  const togglePlayPause = () => {
    if (videoType === 'mp4' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (videoType === 'youtube' && youtubePlayerRef.current) {
      if (isPlaying) {
        youtubePlayerRef.current.pauseVideo();
      } else {
        youtubePlayerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // YouTube Player API callback
  const onYouTubePlayerReady = (player: any) => {
    youtubePlayerRef.current = player;
  };

  // YouTube Iframe API setup
  useEffect(() => {
    if (videoType === 'youtube' && videoUrl) {
      const youtubeId = extractYouTubeVideoId(videoUrl);
      if (youtubeId) {
        new window.YT.Player('youtube-player', {
          videoId: youtubeId,
          events: {
            onReady: (event: any) => onYouTubePlayerReady(event.target),
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else {
                setIsPlaying(false);
              }
            }
          }
        });
      }
    }
  }, [videoUrl, videoType]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkCaptionsAtTime();
    }, 500);

    return () => clearInterval(interval);
  }, [captions, videoType]);

  const extractYouTubeVideoId = (url: string): string | null => {
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.*|(?:v|e(?:mbed)?)\/?([\w\-]+))|youtu\.be\/([\w\-]+))(\?[^#]*)?/i;
    const match = url.match(youtubeRegex);
    return match ? match[1] || match[2] : null;
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.body.appendChild(script);
  }, []);
  
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-center text-gray-700 mb-4">Video Captioning with Timestamps</h1>

      <VideoUrlInput
        videoUrl={videoUrl}
        isValidUrl={isValidUrl}
        onUrlChange={handleUrlChange}
        onSubmit={handleSubmit}
      />

      <CaptionInput
        timestamp={timestamp}
        caption={caption}
        isValidTimestamp={isValidTimestamp}
        isValidCaption={isValidCaption}
        onTimestampChange={handleTimestampChange}
        onCaptionChange={handleCaptionChange}
        onAddCaption={handleAddCaption}
      />

      <VideoDisplay videoUrl={videoUrl} videoType={videoType} extractYouTubeVideoId={extractYouTubeVideoId} />

      <PlayPauseButton isPlaying={isPlaying} onTogglePlayPause={togglePlayPause} />

      <CaptionDisplay captionToDisplay={captionToDisplay} />
    </div>
  );
};

export default VideoPlayer;
