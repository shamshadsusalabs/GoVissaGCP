import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// Star Icon Component
const StarIcon = () => (
  <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Banner = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const [visaInfo, setVisaInfo] = useState<{
    title: string;
    rating: number;
    reviews: number;
    gallery: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisaImages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/configurations/visa/images/${id}`);
        const data = await response.json();

        if (!data.success || !data.images || data.images.length === 0) {
          throw new Error("No images found");
        }

        setVisaInfo({
          title: "Dubai Visa for Indians", // Can be dynamic
          rating: 4.86,
          reviews: 821,
          gallery: data.images,
        });

        setMainImage(data.images[0]);
        setError(null);
      } catch (err) {
        console.error("Error fetching visa images:", err);
        setError("Failed to load visa images");
        setVisaInfo(null);
        setMainImage(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVisaImages();
  }, [id]);

  // Auto-scroll carousel
  useEffect(() => {
    if (!visaInfo?.gallery?.length) return;

    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollSpeed = 1;
    const autoScroll = () => {
      if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
        carousel.scrollLeft = 0;
      } else {
        carousel.scrollLeft += scrollSpeed;
      }
    };

    const intervalId = window.setInterval(autoScroll, 20);
    return () => window.clearInterval(intervalId);
  }, [visaInfo?.gallery]);

  const handleImageClick = (img: string) => {
    setMainImage(img);
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
    }
  };

  if (loading) {
    return (
      <div className="mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="h-64 md:h-80 lg:h-96 flex items-center justify-center">
            <div className="animate-pulse text-gray-500">Loading images...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !visaInfo || !mainImage) {
    return (
      <div className="mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="h-64 md:h-80 lg:h-96 flex items-center justify-center">
            <div className="text-red-500">{error || "No images available"}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Hero Section */}
        <div className="relative h-64 md:h-80 lg:h-96">
          <img
            src={mainImage}
            alt="Dubai Visa Banner"
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 flex items-end p-6">
          
          </div>
        </div>

        {/* Carousel Section */}
        {visaInfo.gallery.length > 1 && (
          <div className="relative group">
            <div
              ref={carouselRef}
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: 'none' }}
            >
              {visaInfo.gallery.map((img, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/4 p-1 snap-start cursor-pointer ${
                    mainImage === img ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => handleImageClick(img)}
                >
                  <div className="relative aspect-video overflow-hidden rounded-lg hover:border-blue-500 transition-all">
                    <img
                      src={img}
                      alt={`Dubai Attraction ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rating Footer */}
        <div className="p-4 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-full">
            <StarIcon />
            <span className="font-medium text-blue-700">{visaInfo.rating}★</span>
          </div>
          <a
            href="#reviews"
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold underline"
          >
            {visaInfo.reviews} Reviews
          </a>
        </div>
      </div>
    </div>
  );
};

export default Banner;
