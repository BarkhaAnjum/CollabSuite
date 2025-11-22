import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle } from 'react-konva';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const Whiteboard = ({ onlineUsers }) => {
  // All elements synced via Yjs (strokes + shapes)
  const [elements, setElements] = useState([]);
  // Element being drawn right now
  const [currentElement, setCurrentElement] = useState(null);

  // Tools: pencil, pen, marker, sketch, eraser, line, rect, circle
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);

  const isDrawing = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  const ydocRef = useRef(null);
  const providerRef = useRef(null);
  const yElementsRef = useRef(null);
  const redoStackRef = useRef([]);

  // -------- Yjs setup (shared whiteboard) --------
  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      'wss://demos.yjs.dev',
      'collabsuite-whiteboard-room-v3',
      ydoc
    );

    const yElements = ydoc.getArray('elements');

    const syncFromYjs = () => {
      setElements(yElements.toArray());
    };

    syncFromYjs();
    yElements.observe(syncFromYjs);

    ydocRef.current = ydoc;
    providerRef.current = provider;
    yElementsRef.current = yElements;

    return () => {
      yElements.unobserve(syncFromYjs);
      provider.destroy();
      ydoc.destroy();
    };
  }, []);

  // -------- Helper: style for each brush type --------
  const getStrokeStyle = (toolName, currentColor, baseWidth) => {
    // Defaults
    let stroke = currentColor;
    let width = baseWidth;
    let opacity = 1;
    let dash = [];
    let gco = 'source-over'; // globalCompositeOperation

    switch (toolName) {
      case 'pencil':
        width = Math.max(1, baseWidth - 1);
        opacity = 1;
        break;
      case 'pen':
        width = baseWidth;
        opacity = 1;
        break;
      case 'marker':
        width = baseWidth * 2;
        opacity = 0.4; // see-through
        break;
      case 'sketch':
        width = baseWidth;
        opacity = 0.9;
        dash = [6, 4]; // dashed like sketch
        break;
      case 'eraser':
        stroke = '#000000'; // color doesn't matter, it erases
        width = baseWidth * 2;
        opacity = 1;
        gco = 'destination-out'; // actually erase pixels
        break;
      default:
        break;
    }

    return {
      stroke,
      strokeWidth: width,
      opacity,
      dash,
      globalCompositeOperation: gco,
    };
  };

  // -------- Pointer handlers --------
  const handlePointerDown = (e) => {
    isDrawing.current = true;

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    if (!pos) return;

    startPosRef.current = { x: pos.x, y: pos.y };
    const id = Date.now();

    const style = getStrokeStyle(tool, color, strokeWidth);

    // Brush-like tools = line
    if (['pencil', 'pen', 'marker', 'sketch', 'eraser'].includes(tool)) {
      setCurrentElement({
        id,
        type: 'line',
        tool,
        points: [pos.x, pos.y],
        lineCap: 'round',
        lineJoin: 'round',
        ...style,
      });
    } else if (tool === 'line') {
      setCurrentElement({
        id,
        type: 'straight-line',
        x1: pos.x,
        y1: pos.y,
        x2: pos.x,
        y2: pos.y,
        ...style,
      });
    } else if (tool === 'rect') {
      setCurrentElement({
        id,
        type: 'rect',
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        ...style,
      });
    } else if (tool === 'circle') {
      setCurrentElement({
        id,
        type: 'circle',
        x: pos.x,
        y: pos.y,
        radius: 0,
        ...style,
      });
    }
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current || !currentElement) return;

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    if (!pos) return;

    if (currentElement.type === 'line') {
      setCurrentElement((prev) => ({
        ...prev,
        points: [...prev.points, pos.x, pos.y],
      }));
    } else if (currentElement.type === 'straight-line') {
      setCurrentElement((prev) => ({
        ...prev,
        x2: pos.x,
        y2: pos.y,
      }));
    } else if (currentElement.type === 'rect') {
      const { x, y } = startPosRef.current;
      setCurrentElement((prev) => ({
        ...prev,
        x,
        y,
        width: pos.x - x,
        height: pos.y - y,
      }));
    } else if (currentElement.type === 'circle') {
      const { x, y } = startPosRef.current;
      const dx = pos.x - x;
      const dy = pos.y - y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      setCurrentElement((prev) => ({
        ...prev,
        x,
        y,
        radius,
      }));
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    if (!currentElement) return;

    // Filter out tiny clicks
    if (currentElement.type === 'line' && currentElement.points.length < 4) {
      setCurrentElement(null);
      return;
    }
    if (currentElement.type === 'straight-line') {
      if (
        Math.abs(currentElement.x2 - currentElement.x1) < 2 &&
        Math.abs(currentElement.y2 - currentElement.y1) < 2
      ) {
        setCurrentElement(null);
        return;
      }
    }
    if (currentElement.type === 'rect') {
      if (
        Math.abs(currentElement.width) < 4 &&
        Math.abs(currentElement.height) < 4
      ) {
        setCurrentElement(null);
        return;
      }
    }
    if (currentElement.type === 'circle' && currentElement.radius < 4) {
      setCurrentElement(null);
      return;
    }

    // Save to Yjs (sync for all users)
    if (yElementsRef.current) {
      yElementsRef.current.push([currentElement]);
      redoStackRef.current = []; // any new draw clears redo
    }

    setCurrentElement(null);
  };

  // -------- Actions: Clear / Undo / Redo --------
  const handleClear = () => {
    if (yElementsRef.current) {
      yElementsRef.current.delete(0, yElementsRef.current.length);
    }
    setElements([]);
    setCurrentElement(null);
    redoStackRef.current = [];
  };

  const handleUndo = () => {
    if (!yElementsRef.current) return;
    const len = yElementsRef.current.length;
    if (len === 0) return;

    const last = yElementsRef.current.get(len - 1);
    redoStackRef.current.push(last);
    yElementsRef.current.delete(len - 1, 1);
  };

  const handleRedo = () => {
    if (!yElementsRef.current) return;
    if (redoStackRef.current.length === 0) return;

    const el = redoStackRef.current.pop();
    yElementsRef.current.push([el]);
  };

  // -------- Sizes --------
  const width =
    typeof window !== 'undefined' ? Math.max(window.innerWidth - 360, 400) : 800;
  const height =
    typeof window !== 'undefined' ? Math.max(window.innerHeight - 260, 300) : 400;

  const COLORS = [
    '#000000',
    '#4f46e5',
    '#22c55e',
    '#eab308',
    '#ef4444',
    '#f97316',
    '#06b6d4',
    '#ffffff',
  ];

  // -------- Render --------
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-4 h-full">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Collaborative Whiteboard</h2>
          <p className="text-sm text-gray-600">
            Paint-style tools with realtime sync. Open this in two browsers to see it sync.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Tools */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setTool('pencil')}
              className={`px-3 py-1 rounded-full border ${
                tool === 'pencil' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white'
              }`}
            >
              ✏️ Pencil
            </button>
            <button
              onClick={() => setTool('pen')}
              className={`px-3 py-1 rounded-full border ${
                tool === 'pen' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white'
              }`}
            >
              🖊️ Pen
            </button>
            <button
              onClick={() => setTool('marker')}
              className={`px-3 py-1 rounded-full border ${
                tool === 'marker' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white'
              }`}
            >
              🖌️ Marker
            </button>
            <button
              onClick={() => setTool('sketch')}
              className={`px-3 py-1 rounded-full border ${
                tool === 'sketch' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white'
              }`}
            >
              ✏️ Sketch
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`px-3 py-1 rounded-full border ${
                tool === 'eraser' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white'
              }`}
            >
              🧼 Eraser
            </button>
            <button
              onClick={() => setTool('line')}
              className={`px-3 py-1 rounded-full border ${
                tool === 'line' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white'
              }`}
            >
              ➖ Line
            </button>
            <button
              onClick={() => setTool('rect')}
              className={`px-3 py-1 rounded-full border ${
                tool === 'rect' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white'
              }`}
            >
              ▭ Rect
            </button>
            <button
              onClick={() => setTool('circle')}
              className={`px-3 py-1 rounded-full border ${
                tool === 'circle' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white'
              }`}
            >
              ⚪ Circle
            </button>
          </div>

          {/* Color palette */}
          <div className="flex items-center gap-1">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  if (tool === 'eraser' && c !== '#ffffff') {
                    setTool('pencil');
                  }
                }}
                className={`w-5 h-5 rounded-full border ${
                  color === c && tool !== 'eraser' ? 'ring-2 ring-indigo-500' : ''
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>

          {/* Brush size */}
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span>Size</span>
            <input
              type="range"
              min="1"
              max="25"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
            />
            <span>{strokeWidth}</span>
          </div>

          {/* Undo / Redo / Clear */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleUndo}
              className="px-3 py-1 rounded-full border bg-white hover:bg-gray-50"
            >
              ↩️ Undo
            </button>
            <button
              onClick={handleRedo}
              className="px-3 py-1 rounded-full border bg-white hover:bg-gray-50"
            >
              ↪️ Redo
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 font-medium"
            >
              🧹 Clear
            </button>
          </div>

          {/* Online users */}
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
            <span className="text-sm text-gray-600">{onlineUsers.length} online</span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 border rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
        <Stage
          width={width}
          height={height}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          <Layer>
            {/* Existing elements from Yjs */}
            {elements.map((el, index) => {
              if (el.type === 'line') {
                return (
                  <Line
                    key={index}
                    points={el.points}
                    stroke={el.stroke}
                    strokeWidth={el.strokeWidth}
                    lineCap={el.lineCap}
                    lineJoin={el.lineJoin}
                    opacity={el.opacity}
                    dash={el.dash || []}
                    globalCompositeOperation={el.globalCompositeOperation || 'source-over'}
                  />
                );
              }
              if (el.type === 'straight-line') {
                return (
                  <Line
                    key={index}
                    points={[el.x1, el.y1, el.x2, el.y2]}
                    stroke={el.stroke}
                    strokeWidth={el.strokeWidth}
                    opacity={el.opacity}
                    globalCompositeOperation={el.globalCompositeOperation || 'source-over'}
                  />
                );
              }
              if (el.type === 'rect') {
                const x = el.width < 0 ? el.x + el.width : el.x;
                const y = el.height < 0 ? el.y + el.height : el.y;
                return (
                  <Rect
                    key={index}
                    x={x}
                    y={y}
                    width={Math.abs(el.width)}
                    height={Math.abs(el.height)}
                    stroke={el.stroke}
                    strokeWidth={el.strokeWidth}
                    opacity={el.opacity}
                    globalCompositeOperation={el.globalCompositeOperation || 'source-over'}
                  />
                );
              }
              if (el.type === 'circle') {
                return (
                  <Circle
                    key={index}
                    x={el.x}
                    y={el.y}
                    radius={el.radius}
                    stroke={el.stroke}
                    strokeWidth={el.strokeWidth}
                    opacity={el.opacity}
                    globalCompositeOperation={el.globalCompositeOperation || 'source-over'}
                  />
                );
              }
              return null;
            })}

            {/* Element currently being drawn (preview) */}
            {currentElement && currentElement.type === 'line' && (
              <Line
                points={currentElement.points}
                stroke={currentElement.stroke}
                strokeWidth={currentElement.strokeWidth}
                lineCap={currentElement.lineCap}
                lineJoin={currentElement.lineJoin}
                opacity={currentElement.opacity}
                dash={currentElement.dash || []}
                globalCompositeOperation={
                  currentElement.globalCompositeOperation || 'source-over'
                }
              />
            )}

            {currentElement && currentElement.type === 'straight-line' && (
              <Line
                points={[
                  currentElement.x1,
                  currentElement.y1,
                  currentElement.x2,
                  currentElement.y2,
                ]}
                stroke={currentElement.stroke}
                strokeWidth={currentElement.strokeWidth}
                opacity={currentElement.opacity}
                globalCompositeOperation={
                  currentElement.globalCompositeOperation || 'source-over'
                }
              />
            )}

            {currentElement && currentElement.type === 'rect' && (
              <Rect
                x={
                  currentElement.width < 0
                    ? currentElement.x + currentElement.width
                    : currentElement.x
                }
                y={
                  currentElement.height < 0
                    ? currentElement.y + currentElement.height
                    : currentElement.y
                }
                width={Math.abs(currentElement.width)}
                height={Math.abs(currentElement.height)}
                stroke={currentElement.stroke}
                strokeWidth={currentElement.strokeWidth}
                opacity={currentElement.opacity}
                globalCompositeOperation={
                  currentElement.globalCompositeOperation || 'source-over'
                }
              />
            )}

            {currentElement && currentElement.type === 'circle' && (
              <Circle
                x={currentElement.x}
                y={currentElement.y}
                radius={currentElement.radius}
                stroke={currentElement.stroke}
                strokeWidth={currentElement.strokeWidth}
                opacity={currentElement.opacity}
                globalCompositeOperation={
                  currentElement.globalCompositeOperation || 'source-over'
                }
              />
            )}
          </Layer>
        </Stage>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-600">
        <span>
          Tools: Pencil, Pen, Marker, Sketch, Eraser, Line, Rect, Circle · Colors · Size · Undo/Redo · Realtime via Yjs.
        </span>
      </div>
    </div>
  );
};

export default Whiteboard;
