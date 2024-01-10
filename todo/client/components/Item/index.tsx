import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import {deleteItem} from '@/services/todo';

type ItemsType = {
  id: UniqueIdentifier;
  title: string;
  deleteItem: (id: string) => void; 
};




const Items = ({ id, title }: ItemsType) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'item',
    },
  });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        'px-2 py-4 bg-white shadow-md rounded-xl w-full border border-transparent hover:border-gray-200 cursor-pointer',
        isDragging && 'opacity-50',
      )}
    >
      <div className="flex items-center justify-between">
        {title}
        <div className='flex a'>
        <button 
          className="border p-1 px-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
          onClick={
            
            
            () => deleteItem(id as string)}
        >
        <svg height="18px"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
        <path d="M10 11V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 11V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        </button>
       

        <button
          className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
          {...listeners}
          >
          Drag Handle
        </button>

            </div>
      </div>
    </div>
  );
};

export default Items;
