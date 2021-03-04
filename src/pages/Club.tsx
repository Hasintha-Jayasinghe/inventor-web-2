import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SliderImage from '../components/SliderImage';
import { auth, db } from '../firebase';
import { Club } from '../types';

const ClubPage = () => {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<Club>();
  const [image, setImage] = useState<string>('headerImg');
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
      .doc(id)
      .onSnapshot(snapshot => {
        const data = snapshot.data() as Club;
        setClub({ ...data, id: snapshot.id });
      });
  }, [id]);

  useEffect(() => {
    if (club !== undefined) {
      document.title = club.name;
    }
  }, [club]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-screen">
        <Header />
        <div className="p-1.5">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{club?.name}</h2>
            <div className="mt-9 flex">
              <div className="flex flex-col">
                <img
                  alt="club header"
                  className="w-80"
                  src={
                    image === 'headerImg'
                      ? club?.headerImg
                      : image === 'image1'
                      ? club?.image1
                      : club?.image2
                  }
                />
                <div className="flex mt-6 w-80">
                  <div className="flex overflow-hidden">
                    <SliderImage
                      alt="headerImg"
                      img={club?.headerImg!}
                      selected={image === 'headerImg'}
                      onClick={() => {
                        setImage('headerImg');
                      }}
                    />
                    <SliderImage
                      alt="image1"
                      img={club?.image1!}
                      selected={image === 'image1'}
                      onClick={() => {
                        setImage('image1');
                      }}
                    />
                    <SliderImage
                      alt="image2"
                      img={club?.image2!}
                      selected={image === 'image2'}
                      onClick={() => {
                        setImage('image2');
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col ml-3 w-96">
                <h1 className="text-3xl font-bold">Description:</h1>
                <p>{club?.description}</p>
                <div className="flex m-3 w-40 items-center justify-around">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <small>{club?.members.length}</small>
                </div>
                {club?.members.includes(auth.currentUser!.uid) ? (
                  <button
                    onClick={() => {
                      const filtered = club.members.filter(val => {
                        return !val.includes(auth.currentUser!.uid);
                      });

                      db.collection('clubs')
                        .doc(id)
                        .update({ members: filtered });
                    }}
                    className="bg-red-500 p-2.5 m-3 text-white rounded outline-none hover:bg-red-600 font-bold"
                  >
                    Leave
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      db.collection('clubs')
                        .doc(id)
                        .update({
                          members: [...club!.members, auth.currentUser!.uid],
                        });
                    }}
                    className="bg-green-500 p-2.5 m-3 text-white rounded outline-none hover:bg-green-600 font-bold"
                  >
                    Join
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubPage;
