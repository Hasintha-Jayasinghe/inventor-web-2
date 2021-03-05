import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { auth, db } from '../firebase';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import { BaseClub } from '../types';
import Club from '../components/Club';

const Clubs = () => {
  const history = useHistory();
  const [clubs, setClubs] = useState<BaseClub[]>([]);

  useEffect(() => {
    document.title = 'Clubs';

    setTimeout(() => {
      if (!auth.currentUser) {
        history.replace('/login');
      }
    }, 1000);
  }, [history]);

  useEffect(() => {
    db.collection('clubs')
      .orderBy('createdDate', 'asc')
      .onSnapshot(snapshot => {
        setClubs(
          snapshot.docs.map(doc => {
            const data = doc.data() as BaseClub;

            return { ...data, id: doc.id };
          })
        );
      });
  }, [setClubs]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-screen">
        <Header />
        <div className="p-1.5">
          <h1 className="text-xl font-semibold">Clubs:</h1>
          <div className="grid grid-cols-4 gap-6">
            {clubs.map(club => {
              return (
                <Club
                  key={club.id}
                  name={club.name}
                  headerImg={club.headerImg}
                  onClick={() => {
                    history.push(`/club/${club.id}`);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clubs;
