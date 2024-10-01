import React, { useRef, useState, useEffect } from 'react';

const LazyLoadedVideo = ({ src, poster, ...props }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    const currentVideoRef = videoRef.current;

    if (currentVideoRef) {
      observer.observe(currentVideoRef);
    }

    return () => {
      if (observer && currentVideoRef) {
        observer.unobserve(currentVideoRef);
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      controls
      poster={poster}
      {...props}
    >
      {isIntersecting && <source src={src} type="video/mp4" />}
    </video>
  );
};

export default LazyLoadedVideo;
