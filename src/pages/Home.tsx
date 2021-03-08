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
    activites: [],
  });

  useEffect(() => {
    document.title = 'Clubs Connect';

    if (!auth.currentUser) {
      history.push('/login');
    }
  }, [history]);

  useEffect(() => {
    db.collection('users')
      .doc(auth.currentUser?.uid)
      .onSnapshot(snapshot => {
        const data = snapshot.data() as BaseUser;
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
          <div className="flex">
            {user.activites.length === 0 ? (
              <div>
                <h1>No activites yet!</h1>
              </div>
            ) : (
              <div className="grid grid-cols-3 grid-rows-3 gap-1 h-4/5 overflow-y-auto">
                {user.activites.map((activity, idx) => {
                  if (activity.dismissed) {
                    return null;
                  }

                  return (
                    <div
                      key={idx}
                      className="flex p-1.5 cursor-pointer flex-col bg-yellow-500 text-white w-96 rounded border"
                    >
                      <h1 className="text-lg font-bold">{activity.title}</h1>
                      <p>{activity.msg}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
