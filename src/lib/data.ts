export interface ImageData {
    id: number;
    url: string;
    alt: string;
    duration: number; // Duration in seconds
  }
  
  export const imageData: ImageData[] = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      alt: "Mountain landscape",
      duration: 2.5,
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      alt: "Forest landscape",
      duration: 2.5,
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      alt: "Sunlight through trees",
      duration: 2.5,
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
      alt: "Lake and mountains",
      duration: 2.5,
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
      alt: "Valley view",
      duration: 2.5,
    },
  ];