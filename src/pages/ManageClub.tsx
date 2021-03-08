import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { auth, db } from '../firebase';
import { BaseUser, Club } from '../types';

const ManageClub = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const { clubId } = useParams<{ clubId: string }>();
  const history = useHistory();

  // Make another state variable to contain the club
  const [club, setClub] = useState<Club>();

  // Make another state variable to contain the members of said club
  const [members, setMembers] = useState<BaseUser[]>([]);

  useEffect(() => {
    document.title = `${club?.name} - Admin`;
  }, [club]);

  useEffect(() => {
    setTimeout(() => {
      if (!auth.currentUser) {
        history.replace('/login');
      }
    }, 1000);
  }, [history]);

  useEffect(() => {
    db.collection('clubs')
      .doc(clubId)
      .onSnapshot(snapshot => {
        const clubData = snapshot.data() as Club;
        setClub(clubData);
      });
  }, [clubId]);

  useEffect(() => {
    if (
      club?.pres === auth.currentUser?.uid ||
      club?.vicePres === auth.currentUser?.uid ||
      club?.editor === auth.currentUser?.uid ||
      club?.secretary === auth.currentUser?.uid
    ) {
      setAuthenticated(true);
    }
  }, [club]);

  useEffect(() => {
    if (members.length === 0) {
      club?.members.map(member => {
        db.collection('users')
          .doc(member)
          .get()
          .then(val => {
            const data = val.data() as BaseUser;
            if (data.uid !== auth.currentUser?.uid) {
              setMembers(m => [...m, data]);
            }
          });

        return true;
      });
    }
  }, [club?.members, members]);

  if (!authenticated) {
    return <h1>Checking Credentials...</h1>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-screen">
        <Header />
        <div className="p-1.5 h-full">
          <div className="flex flex-col">
            <h1 className="text-3xl">{club?.name}</h1>
            <div className="mt-6">
              <button
                onClick={() => {
                  history.push(`/clubs/manage/${clubId}/committee`);
                }}
                className="p-0.5 w-48 rounded hover:bg-green-600 bg-green-500 border-none text-white"
              >
                Committee
              </button>
            </div>
          </div>
          {members.length !== 0 ? (
            <div className="flex h-4/6 overflow-y-auto mt-1.5 flex-col items-center justify-center">
              {members.map(member => {
                return (
                  <div
                    className="flex cursor-pointer items-center p-1.5 m-1.5 border-2 hover:shadow rounded w-4/6"
                    key={member.uid}
                  >
                    <div className="flex w-3/6 items-center justify-around">
                      <div className="w-20 hover:opacity-75 duration-200 cursor-pointer h-20 rounded-full flex items-center justify-center bg-gray-600">
                        <h1 className="text-5xl text-gray-400 p-2.5">
                          {member.firstName.charAt(0)}
                          {member.lastName.charAt(0)}
                        </h1>
                      </div>
                      <div className="flex flex-col">
                        <h1>
                          {member.firstName} {member.lastName}
                        </h1>
                        <small>{member.email}</small>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex overflow-y-auto mt-1 5 flex-col items-center justify-center">
              <h1>No Members in your club! 😢</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageClub;
