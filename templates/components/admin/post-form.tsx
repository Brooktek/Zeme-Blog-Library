// Placeholder for Post Form component
import React from 'react';

const PostForm = () => {
  return (
    <form className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input type="text" id="title" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
        <textarea id="content" rows={10} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save Post</button>
    </form>
  );
};

export default PostForm;
