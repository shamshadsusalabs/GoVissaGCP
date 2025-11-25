import React from 'react';

const AtlysNews: React.FC = () => {
  const emptyCards = new Array(5).fill(null); // Still rendering 5 empty cards

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center text-gray-900 mb-16 tracking-tight">
          Visaafy in the News
        </h2>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 justify-items-center">
          {emptyCards.map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 w-full max-w-[240px] p-6 text-center flex flex-col items-center"
            >
              {/* Empty card - content removed */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AtlysNews;
