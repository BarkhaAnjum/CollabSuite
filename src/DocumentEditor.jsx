import React, { useState, useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const DocumentEditor = ({ onlineUsers }) => {
  const [content, setContent] = useState(
    '# Welcome to Collaborative Editing\n\nStart typing here...'
  );

  const ydocRef = useRef(null);
  const providerRef = useRef(null);
  const yTextRef = useRef(null);

  useEffect(() => {
    const ydoc = new Y.Doc();

    const provider = new WebsocketProvider(
      'wss://demos.yjs.dev',
      'collabsuite-document-room',
      ydoc
    );

    const yText = ydoc.getText('content');

    if (yText.length === 0) {
      yText.insert(0, content);
    } else {
      setContent(yText.toString());
    }

    const updateHandler = () => {
      setContent(yText.toString());
    };
    yText.observe(updateHandler);

    ydocRef.current = ydoc;
    providerRef.current = provider;
    yTextRef.current = yText;

    return () => {
      yText.unobserve(updateHandler);
      provider.destroy();
      ydoc.destroy();
    };
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setContent(newValue);

    if (yTextRef.current) {
      const yText = yTextRef.current;
      yText.delete(0, yText.length);
      yText.insert(0, newValue);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm h-full">
      <div className="border-b p-4 flex items-center justify-between">
        <input
          type="text"
          defaultValue="Untitled Document"
          className="text-xl font-semibold border-none focus:outline-none"
        />
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {onlineUsers.slice(0, 3).map((u) => (
              <div
                key={u.id}
                className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
              >
                {u.name[0]}
              </div>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {onlineUsers.length} editing
          </span>
        </div>
      </div>
      <textarea
        value={content}
        onChange={handleChange}
        className="w-full h-96 p-6 focus:outline-none resize-none font-mono"
      />
    </div>
  );
};

export default DocumentEditor;
