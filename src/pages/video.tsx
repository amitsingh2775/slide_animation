"use client";

import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
// import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { imageData, ImageData } from "../lib/data";

const VideoAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<ImageData[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state on client side
  useEffect(() => {
    setIsMounted(true);
    // Add extra copies to ensure smooth looping
    setImages([...imageData, ...imageData, ...imageData]);
  }, []);

  // Initialize GSAP timeline
  useEffect(() => {
    if (!containerRef.current || images.length === 0 || !isMounted) return;

    // Clear any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Create a new timeline
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        // Reset timeline for infinite loop
        tl.seek(0).play();
      },
    });
    
    timelineRef.current = tl;

    // Get all image elements
    const imageElements = containerRef.current.querySelectorAll(".animation-image");
    
    // Set initial positions
    gsap.set(imageElements, {
      xPercent: 100,
      opacity: 0,
      scale: 1.1,
    });

    // Create animation sequence
    imageElements.forEach((img, index) => {
      const duration = images[index]?.duration || 2.5;
      
      tl.to(
        img,
        {
          xPercent: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
        },
        index * duration
      )
        .to(
          img,
          {
            xPercent: -100,
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: "power2.in",
            onStart: () => {
              setCurrentIndex((index + 1) % imageData.length);
            },
          },
          (index + 1) * duration - 1
        );
    });

    setIsInitialized(true);

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [images, isMounted]);

  // Play/Pause controls
  const togglePlayPause = () => {
    if (!timelineRef.current) return;

    if (isPlaying) {
      timelineRef.current.pause();
    } else {
      timelineRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  // Auto-pause when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!timelineRef.current) return;
      
      if (document.visibilityState === 'visible' && isPlaying) {
        timelineRef.current.play();
      } else {
        timelineRef.current.pause();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Force re-render on resize
      setIsMounted(false);
      setTimeout(() => setIsMounted(true), 0);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // If not mounted yet (client-side), show nothing or a loading state
  if (!isMounted) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading animation...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Animation container */}
      <div 
        ref={containerRef} 
        className="relative w-full h-full"
      >
        {images.map((image, index) => (
          <div
            key={`${image.id}-${index}`}
            className="animation-image absolute inset-0 w-full h-full"
            style={{ visibility: isInitialized ? 'visible' : 'hidden' }}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading={index < 5 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-4">
      <button onClick={togglePlayPause} className="flex items-center px-6 py-3 text-white bg-white/20 rounded-full backdrop-blur-md hover:bg-white/30">
          {isPlaying ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
           {isPlaying 
  ? "Pause" 
  : timelineRef.current && typeof timelineRef.current.time === "function" && timelineRef.current.time() > 0 
    ? "Resume" 
    : "Play"
}

        </button>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{ 
            width: `${(currentIndex / imageData.length) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default VideoAnimation;
