// Placeholder for Tag Badge component
import React from 'react';

const TagBadge = ({ tag }: { tag: { name: string } }) => {
  return (
    <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
      {tag.name}
    </span>
  );
};

export default TagBadge;
