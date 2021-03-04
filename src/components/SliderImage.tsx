import React from 'react';

interface Props {
  selected: boolean;
  img: string;
  alt: string;
  onClick?: () => void;
  ref?: React.RefObject<HTMLImageElement>;
}

const SliderImage: React.FC<Props> = ({ selected, ref, img, alt, onClick }) => {
  return (
    <img
      ref={ref}
      alt={alt}
      onClick={onClick}
      src={img}
      className={`w-28 mr-2 cursor-pointer p-0.5 ${
        selected ? 'border-2 border-gray-600' : null
      }`}
    />
  );
};

export default SliderImage;
