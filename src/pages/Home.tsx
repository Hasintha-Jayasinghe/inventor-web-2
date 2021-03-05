import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../firebase';
import { BaseUser } from '../types';
import UserDetails from '../components/UserDetails';
import Header from '../components/Header';

const Home = () => {
  const history = useHistory();
  const [user, setUser] = useState<BaseUser>({
    email: '',
    firstName: '',
    lastName: '',
    level: '',
    parentEmail: '',
    phone: '',
    uid: '',
  });

  useEffect(() => {
    document.title = 'STPS Clubs';

    if (!auth.currentUser) {
      history.push('/login');
    }
  }, [history]);

  useEffect(() => {
    db.collection('users')
      .doc(auth.currentUser?.uid)
      .get()
      .then(val => {
        const data = val.data() as BaseUser;
        setUser(data);
      });

    return () => {};
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-screen">
        <Header />
        <div className="p-1.5">
          <UserDetails
            email={user.email}
            firstName={user.firstName}
            lastName={user.lastName}
            level={user.level}
          />
          <h1 className="text-xl">New Activities: </h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
