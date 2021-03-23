import React from 'react';

interface Props {
  name: string;
  headerImg: string;
  onClick?: () => void;
}

const Club: React.FC<Props> = ({ name, headerImg, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col bg-white cursor-pointer p-1.5 border-solid border-gray-700 rounded border-2 text-black"
    >
      <img alt="club-header" src={headerImg} className="self-start" />
      <div className="flex">
        <h2 className="font-bold text-2xl">{name}</h2>
      </div>
    </div>
  );
};

export default Club;
