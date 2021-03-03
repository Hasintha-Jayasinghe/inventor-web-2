import React from 'react';
import ReactTooltip from 'react-tooltip';

interface Props {
  children: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
}

const SidebarItem: React.FC<Props> = ({ children, tooltip, onClick }) => {
  return (
    <>
      <div
        onClick={onClick}
        data-tip={tooltip}
        className="flex items-center justify-center py-2 cursor-pointer"
      >
        {children}
      </div>
      <ReactTooltip />
    </>
  );
};

export default SidebarItem;
