import React, { useState, useEffect, useRef } from 'react';
import { SectionStyle } from '../../lib/types';
import { cn } from '../../lib/utils';
import { Type, Palette, Maximize, AlignLeft, AlignCenter, AlignRight, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditableProps {
  id: string;
  value: string;
  isEditing?: boolean;
  onUpdate?: (id: string, value: string, style?: SectionStyle) => void;
  style?: SectionStyle;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  placeholder?: string;
  multiline?: boolean;
}

export function Editable({ id, value, isEditing, onUpdate, style, className, as: Component = 'span', placeholder, multiline }: EditableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [tempStyle, setTempStyle] = useState<SectionStyle>(style || {});
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempValue(value);
    setTempStyle(style || {});
  }, [value, style]);

  if (!isEditing) {
    return (
      <Component 
        className={className} 
        style={{
          fontSize: style?.fontSize,
          color: style?.color,
          fontFamily: style?.fontFamily,
          fontWeight: style?.fontWeight,
          textAlign: style?.textAlign,
        }}
      >
        {value || placeholder}
      </Component>
    );
  }

  const handleSave = () => {
    onUpdate?.(id, tempValue, tempStyle);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block group max-w-full">
      <Component 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={cn(className, "cursor-pointer hover:ring-2 hover:ring-primary-500 hover:ring-offset-2 rounded transition-all")}
        style={{
          fontSize: tempStyle.fontSize,
          color: tempStyle.color,
          fontFamily: tempStyle.fontFamily,
          fontWeight: tempStyle.fontWeight,
          textAlign: tempStyle.textAlign,
        }}
      >
        {tempValue || placeholder}
      </Component>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
            <motion.div 
              ref={popoverRef}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute z-[101] bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 text-left"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-900">Editar Apartado</h4>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Texto</label>
                  {multiline ? (
                    <textarea 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none text-gray-900"
                      rows={3}
                    />
                  ) : (
                    <input 
                      type="text" 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900"
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Tamaño (pt)</label>
                    <div className="flex items-center gap-2">
                      <Maximize className="w-3 h-3 text-gray-400" />
                      <input 
                        type="text" 
                        value={tempStyle.fontSize || ''}
                        onChange={(e) => setTempStyle(s => ({ ...s, fontSize: e.target.value }))}
                        placeholder="Ej. 24pt"
                        className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-primary-500 outline-none text-gray-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Color</label>
                    <div className="flex items-center gap-2">
                      <Palette className="w-3 h-3 text-gray-400" />
                      <input 
                        type="color" 
                        value={tempStyle.color || '#000000'}
                        onChange={(e) => setTempStyle(s => ({ ...s, color: e.target.value }))}
                        className="w-full h-6 p-0 border-none rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Fuente</label>
                  <div className="flex items-center gap-2">
                    <Type className="w-3 h-3 text-gray-400" />
                    <select 
                      value={tempStyle.fontFamily || ''}
                      onChange={(e) => setTempStyle(s => ({ ...s, fontFamily: e.target.value }))}
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-primary-500 outline-none bg-white text-gray-900"
                    >
                      <option value="">Predeterminada</option>
                      <option value="font-serif">Serif (Tema)</option>
                      <option value="font-sans">Sans (Tema)</option>
                      <option value="font-mono">Mono (Tema)</option>
                      <option value="'Playfair Display', serif">Playfair Display</option>
                      <option value="'Great Vibes', cursive">Great Vibes</option>
                      <option value="'Montserrat', sans-serif">Montserrat</option>
                      <option value="'Cinzel', serif">Cinzel</option>
                      <option value="'Dancing Script', cursive">Dancing Script</option>
                      <option value="'Cormorant Garamond', serif">Cormorant Garamond</option>
                      <option value="'Alex Brush', cursive">Alex Brush</option>
                      <option value="'Pacifico', cursive">Pacifico</option>
                      <option value="'Satisfy', cursive">Satisfy</option>
                      <option value="'Marck Script', cursive">Marck Script</option>
                      <option value="'Sacramento', cursive">Sacramento</option>
                      <option value="'Lobster', cursive">Lobster</option>
                      <option value="'Abril Fatface', serif">Abril Fatface</option>
                      <option value="'Bebas Neue', sans-serif">Bebas Neue</option>
                      <option value="'Cookie', cursive">Cookie</option>
                      <option value="'Parisienne', cursive">Parisienne</option>
                      <option value="'Rochester', cursive">Rochester</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setTempStyle(s => ({ ...s, textAlign: 'left' }))}
                      className={cn("p-1.5 rounded hover:bg-gray-100", tempStyle.textAlign === 'left' && "bg-gray-100")}
                    >
                      <AlignLeft className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => setTempStyle(s => ({ ...s, textAlign: 'center' }))}
                      className={cn("p-1.5 rounded hover:bg-gray-100", (tempStyle.textAlign === 'center' || !tempStyle.textAlign) && "bg-gray-100")}
                    >
                      <AlignCenter className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => setTempStyle(s => ({ ...s, textAlign: 'right' }))}
                      className={cn("p-1.5 rounded hover:bg-gray-100", tempStyle.textAlign === 'right' && "bg-gray-100")}
                    >
                      <AlignRight className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                  </div>
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Aplicar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
