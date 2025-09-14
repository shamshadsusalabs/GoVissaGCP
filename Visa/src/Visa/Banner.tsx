import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Banner = () => {
  const { id } = useParams<{ id: string }>();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/configurations/visa/images/${id}`
        );
        const data = await res.json();
        if (!data.success || !data.images?.length) throw new Error("No image");
        setImage(data.images[0]);
      } catch {
        setError("Could not load image");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchImage();
  }, [id]);

  /* ---------- Skeleton ---------- */
  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="aspect-[16/9] md:aspect-[21/9] bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error || !image) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="aspect-[16/9] md:aspect-[21/9] bg-gray-100 rounded-2xl flex items-center justify-center text-red-500 font-medium">
          {error || "No image"}
        </div>
      </div>
    );
  }

  /* ---------- Image ---------- */
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 mt-20">
      <img
        src={image}
        alt="Dubai Visa"
        className="w-full h-auto aspect-[16/9] md:aspect-[21/9] object-cover rounded-2xl shadow-xl"
        loading="eager"
      />
    </div>
  );
};

export default Banner;