import React from 'react';

interface Props {
  firstName: string;
  lastName: string;
  email: string;
}

const UserDetails: React.FC<Props> = ({ firstName, lastName, email }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center">
      <div className="p-3.5 w-1/2">
        <div className="w-20 hover:opacity-75 duration-200 cursor-pointer h-20 rounded-full flex items-center justify-center bg-gray-600">
          <h1 className="text-5xl text-gray-400 p-2.5">
            {firstName.charAt(0)}
            {lastName.charAt(0)}
          </h1>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-start left-0 w-500 origin-left 400 w-56">
          <h1 className="text-lg font-bold pr-2">{firstName}</h1>
          <h1 className="text-lg font-bold">{lastName}</h1>
        </div>
        <small>{email}</small>
      </div>
    </div>
  );
};

export default UserDetails;
