import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  currentPage: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentPage }) => {
  return (
    <div className="breadcrumb" aria-label="Breadcrumb">
      <div className="inner flex items-center gap-2">
        <Link to="/">Home</Link>
        <ChevronRight size={12} className="text-gray-400" />
        <span aria-current="page">{currentPage}</span>
      </div>
    </div>
  );
};
