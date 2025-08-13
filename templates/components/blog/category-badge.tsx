// Placeholder for Category Badge component
import React from 'react';

const CategoryBadge = ({ category }: { category: { name: string } }) => {
  return (
    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
      {category.name}
    </span>
  );
};

export default CategoryBadge;
