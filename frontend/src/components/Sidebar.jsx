import React, { useMemo, useState, useRef } from 'react';
import { ChevronDown, ChevronRight, X, Book, FileText, Bookmark } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, data, onSelectArticle, selectedArticle }) => {
  const isInteracting = useRef(false);

  // vuelve arbol la data plana
  const treeData = useMemo(() => {
    const tree = [];
    
    // helper pa buscar o crear nodo
    const findOrCreate = (list, key, label, type) => {
      let node = list.find(item => item.label === label);
      if (!node) {
        node = { key: key || label, label, type, children: [] };
        list.push(node);
      }
      return node;
    };

    data.forEach((item, index) => {
      // genera id unico de navegacion
      // para articulos, disposiciones y la intro
      let navId;
      if (item.tipo === 'introduccion') {
        navId = `intro-${index}`;
      } else if (item.art_num === 398) {
        // excepcion para 398 q esta duplicado
        navId = `art-${item.art_num}-${index}`;
      } else {
         navId = item.art_num ? `art-${item.art_num}` : `disp-${index}`;
      }
      
      // mete el id al item pa q el treenode sepa
      item.navId = navId;

      if (item.tipo === 'introduccion') {
         // maneja la intro
         let introRoot = findOrCreate(tree, 'root-intro', 'Presentación', 'ROOT_INTRO');
         
         introRoot.children.push({
           key: navId,
           label: item.titulo,
           subLabel: item.subtitulo,
           type: 'ARTICLE',
           data: item
         });

      } else if (item.tipo === 'articulo') {
        // logica normal de jerarquia
        
        // 1. parte
        let currentLevel = tree;
        if (item.parte_nom) {
          const parteNode = findOrCreate(currentLevel, item.parte_nom, item.parte_nom, 'PART');
          currentLevel = parteNode.children;
        }

        // 2. titulo
        if (item.titulo_nom) {
          const tituloNode = findOrCreate(currentLevel, item.titulo_nom, item.titulo_nom, 'TITLE');
          currentLevel = tituloNode.children;
        }

        // 3. capitulo
        if (item.capitulo_nom) {
          const capituloNode = findOrCreate(currentLevel, item.capitulo_nom, item.capitulo_nom, 'CHAPTER');
          currentLevel = capituloNode.children;
        }

        // 4. seccion opcional
        if (item.seccion_nom) {
          const seccionNode = findOrCreate(currentLevel, item.seccion_nom, item.seccion_nom, 'SECTION');
          currentLevel = seccionNode.children;
        }

        // 5. articulo hoja
        currentLevel.push({
          key: navId,
          label: `Artículo ${item.art_num}°`,
          subLabel: item.nombre_juridico, // descripcion corta
          type: 'ARTICLE',
          data: item, // almacenar datos completos del articulo
        });

      } else if (item.tipo === 'disposición') {
        // maneja disposiciones
        // todo a la carpeta disposiciones
        let dispRoot = findOrCreate(tree, 'root-disposiciones', 'Disposiciones', 'ROOT_DISP');
        
        // subgrupo por tipo
        let typeNode = findOrCreate(dispRoot.children, item.disposicion, item.disposicion, 'DISP_TYPE');
        
        typeNode.children.push({
          key: navId,
          label: item.parte ? `${item.disposicion} ${item.parte}` : item.disposicion,
          subLabel: item.nombre_juridico,
          type: 'ARTICLE', // tipo articulo pa q sea clickeable
          data: item
        });
      }
    });

    return tree;
  }, [data]);

  // scroll al item seleccionado
  React.useEffect(() => {
    if (selectedArticle && selectedArticle.navId && !isInteracting.current) {
      const element = document.getElementById(`sidebar-article-${selectedArticle.navId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedArticle]);

  return (
    <>
      {/* barra lateral flotante */}
      <div 
        className={`
          fixed top-20 left-4 bottom-16 w-96 bg-white dark:bg-[#1A1D21] rounded-2xl shadow-2xl 
          flex flex-col z-50 font-sans border border-gray-100 dark:border-gray-800 overflow-hidden
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-[120%]'}
        `}
        onMouseEnter={() => isInteracting.current = true}
        onMouseLeave={() => isInteracting.current = false}
        onTouchStart={() => isInteracting.current = true}
        onTouchEnd={() => isInteracting.current = false}
      >
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A1D21]">
          <h3 className="text-gray-700 dark:text-gray-200 font-semibold font-sans">Índice</h3>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {treeData.map((node, index) => (
            <TreeNode 
              key={index} 
              node={node} 
              onSelect={(article) => {
                onSelectArticle(article);
              }} 
              selectedArticle={selectedArticle}
              level={0}
            />
          ))}
        </div>
      </div>
    </>
  );
};

// componente recursivo del arbol
const TreeNode = ({ node, onSelect, selectedArticle, level }) => {
  const isLeaf = node.type === 'ARTICLE';

  // verificar si este nodo esta seleccionado para hojas o contiene la seleccion para carpetas
  const isSelfSelected = isLeaf && selectedArticle && selectedArticle.navId === node.data.navId;
  
  // verificacion recursiva para ruta activa
  const hasSelectedChild = useMemo(() => {
    if (isLeaf) return false;
    const checkChildren = (children) => {
      return children.some(child => {
        if (child.type === 'ARTICLE') {
          return selectedArticle && child.data.navId === selectedArticle.navId;
        }
        return checkChildren(child.children);
      });
    };
    return node.children && checkChildren(node.children);
  }, [node, isLeaf, selectedArticle]);

  // auto expandir si esta en la ruta activa
  const [isExpanded, setIsExpanded] = useState(hasSelectedChild);
  
  // actualizar expansion cuando cambia la seleccion opcional pero bueno para seguir seleccion
  React.useEffect(() => {
    if (hasSelectedChild) {
      setIsExpanded(true);
    }
  }, [hasSelectedChild]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (isLeaf) {
      onSelect(node.data);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  // sangria segun nivel
  const paddingLeft = `${level * 12 + 12}px`;
  
  // estilo si esta activo
  const isActivePath = hasSelectedChild || isSelfSelected;
  const activeUserStyle = isSelfSelected 
    ? 'bg-blue-600 dark:bg-[#FCD34D] text-white dark:text-black shadow-md font-bold' 
    : isActivePath 
      ? 'text-blue-800 dark:text-[#FCD34D] font-semibold' 
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800';

  return (
    <div className="mb-1">
      <div 
        id={isLeaf ? `sidebar-article-${node.data.navId}` : undefined}
        onClick={handleClick}
        className={`
          group flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200
          ${activeUserStyle}
        `}
        style={{ paddingLeft }}
      >
        {/* icono flechita */}
        <div className={`mt-0.5 flex-shrink-0 ${
          isSelfSelected 
            ? 'text-white dark:text-black' 
            : isActivePath 
              ? 'text-blue-600 dark:text-[#FCD34D]' 
              : 'text-gray-400 dark:text-gray-500'
        }`}>
          {!isLeaf ? (
            isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          ) : (
            <FileText size={16} />
          )}
        </div>

        {/* contenido */}
        <div className="flex-1">
          <div className={`text-sm leading-tight ${isActivePath ? 'font-bold' : 'font-medium'}`}>
            {node.label}
          </div>
          {node.subLabel && (
            <div className={`text-xs mt-0.5 line-clamp-1 ${
              isSelfSelected 
                ? 'text-blue-100 dark:text-gray-900' 
                : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500'
            }`}>
              {node.subLabel}
            </div>
          )}
        </div>
      </div>

      {/* hijos */}
      {isExpanded && node.children && (
        <div className="relative">
          {/* Tree Guide Line */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" 
            style={{ left: `${level * 12 + 19}px` }} 
          />
          {node.children.map((child, idx) => (
            <TreeNode 
              key={idx} 
              node={child} 
              onSelect={onSelect} 
              selectedArticle={selectedArticle} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
