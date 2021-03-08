import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useHistory, useParams } from 'react-router-dom';
import { Club } from '../types';
import { auth, db } from '../firebase';

const ClubCommittee = () => {
  const { clubId } = useParams<{ clubId: string }>();

  const [club, setClub] = useState<Club>();
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const history = useHistory();

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
        const data = snapshot.data() as Club;
        setClub(data);
      });
  }, [clubId]);

  useEffect(() => {
    document.title = `${club?.name} - Committee`;
    if (
      club?.pres === auth.currentUser?.uid ||
      club?.vicePres === auth.currentUser?.uid ||
      club?.editor === auth.currentUser?.uid ||
      club?.secretary === auth.currentUser?.uid
    ) {
      setAuthenticated(true);
    }
  }, [club]);

  if (!authenticated) {
    return <h1 className="text-lg">Checking Credentials</h1>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-screen">
        <Header />
        <div className="p-1.5">
          <h1>Committee</h1>
          <h1>{club?.name}</h1>
        </div>
      </div>
    </div>
  );
};

export default ClubCommittee;
