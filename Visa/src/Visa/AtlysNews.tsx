import React from 'react';

const AtlysNews: React.FC = () => {
  const newsItems = [
    {
      logo: 'FORTUNE',
      text: ['Susalabs Streamlines', 'Visa Process as', 'Borders Reopen'],
    },
    {
      logo: 'Forbes',
      text: ['How Governments', 'Can Streamline Visas'],
    },
    {
      logo: 'FASTCOMPANY',
      text: ['The 10 most', 'innovative travel', 'companies of 2022'],
    },
    {
      logo: 'The Washington Post',
      text: ['Gamechangers: atlys', 'as Winner in', 'Technology sector'],
    },
    {
      logo: 'TechCrunch',
      text: ['Atlys raises $4.25M', 'to make visas faster', 'and easier'],
    },
  ];

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center text-gray-900 mb-16 tracking-tight">
          GoVisaa in the News
        </h2>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 justify-items-center">
          {newsItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 w-full max-w-[240px] p-6 text-center flex flex-col items-center group"
            >
              <div className="text-2xl font-black text-gray-900 mb-4 tracking-tighter uppercase">
                {item.logo}
              </div>
              <div className="text-[15px] text-gray-600 leading-tight space-y-2 font-medium">
                {item.text.map((line, idx) => (
                  <div key={idx} className="group-hover:text-gray-800 transition-colors">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AtlysNews;