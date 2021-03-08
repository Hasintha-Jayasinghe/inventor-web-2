import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TextField from '../components/TextField';
import { auth, db, storage } from '../firebase';
import { BaseUser } from '../types';
import * as Yup from 'yup';
import firebase from 'firebase';
import { v4 } from 'uuid';

const RegisterSchema = Yup.object().shape({
  description: Yup.string().min(50).required('This is required'),
  presidentEmail: Yup.string()
    .email('Invalid email format')
    .matches(/^[\w-.]+@stps.edu.lk$/, 'Only students of STPS')
    .required('Required'),
  vicePresident: Yup.string()
    .email('Invalid email format')
    .matches(/^[\w-.]+@stps.edu.lk$/, 'Only students of STPS')
    .required('Required'),
  editorEmail: Yup.string()
    .email('Invalid email format')
    .matches(/^[\w-.]+@stps.edu.lk$/, 'Only students of STPS')
    .required('Required'),
});

const RegisterClub = () => {
  const [authorized, setAurthorized] = useState(false);

  const history = useHistory();
  const headerImgRef = useRef<HTMLInputElement>(null);
  const image1 = useRef<HTMLInputElement>(null);
  const image2 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = 'Register Club';

    db.collection('users')
      .doc(auth.currentUser?.uid)
      .get()
      .then(val => {
        const data = val.data() as BaseUser;

        if (data && data.level !== 'admin3') {
          history.push('/');
        } else {
          setAurthorized(true);
        }
      });
  }, [history]);

  if (!authorized) {
    return <h1>Checking credentials</h1>;
  }

  return (
    <div className="h-screen w-full flex justify-center items-center bg-gray-800">
      <div className="w-full max-w-md bg-gray-800">
        <Formik
          initialValues={{
            name: '',
            presidentEmail: '',
            vicePresident: '',
            description: '',
            editorEmail: '',
          }}
          validationSchema={RegisterSchema}
          onSubmit={(values, { setErrors }) => {
            if (!values.name) {
              setErrors({ name: 'Required' });
            } else {
              db.collection('users')
                .where('email', '>=', values.presidentEmail)
                .where('email', '<=', values.presidentEmail)
                .get()
                .then(val => {
                  // console.log(val.docs);
                  if (val.docs.length === 0) {
                    setErrors({
                      presidentEmail: 'Could not find user with this email',
                    });
                  } else {
                    db.collection('users')
                      .where('email', '>=', values.vicePresident)
                      .where('email', '<=', values.vicePresident)
                      .get()
                      .then(value => {
                        if (value.docs.length === 0) {
                          setErrors({
                            vicePresident:
                              'Could not find user with this email',
                          });
                        } else {
                          db.collection('users')
                            .where('email', '>=', values.editorEmail)
                            .where('email', '<=', values.editorEmail)
                            .get()
                            .then(editor => {
                              if (editor.docs.length === 0) {
                                setErrors({
                                  editorEmail:
                                    'Could not find user with this email',
                                });
                              } else {
                                const edtr = editor.docs[0].data();

                                const pres = val.docs[0].data();
                                const vicePres = value.docs[0].data();
                                db.collection('clubs')
                                  .add({
                                    createdDate: firebase.firestore.FieldValue.serverTimestamp(),
                                    description: values.description,
                                    name: values.name,
                                    members: [],
                                    pres: pres.uid,
                                    vicePres: vicePres.uid,
                                    editor: edtr.uid,
                                  })
                                  .then(async val => {
                                    let headerImgUrl = '';
                                    let image1Url = '';
                                    let image2Url = '';

                                    const id = val.id;
                                    const storageRefHeaderImg = storage.ref(
                                      `clubs/${id}/headerImg.jpg`
                                    );
                                    await storageRefHeaderImg.put(
                                      headerImgRef!.current!.files![0]
                                    );
                                    headerImgUrl = await storageRefHeaderImg.getDownloadURL();

                                    const storageRefImage1 = storage.ref(
                                      `club/${id}/image1.jpg`
                                    );
                                    await storageRefImage1.put(
                                      image1!.current!.files![0]
                                    );
                                    image1Url = await storageRefImage1.getDownloadURL();

                                    const storageRefImage2 = storage.ref(
                                      `club/${id}/image2.jpg`
                                    );
                                    await storageRefImage2.put(
                                      image2!.current!.files![0]
                                    );
                                    image2Url = await storageRefImage2.getDownloadURL();

                                    await db
                                      .collection('clubs')
                                      .doc(id)
                                      .update({
                                        headerImg: headerImgUrl,
                                        image1: image1Url,
                                        image2: image2Url,
                                      });

                                    const date = new Date();
                                    const dateString = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

                                    await db
                                      .collection('users')
                                      .doc(pres.uid)
                                      .update({
                                        activites: firebase.firestore.FieldValue.arrayUnion(
                                          {
                                            title: `You're now the President of the ${values.name}!`,
                                            msg: `You're now the President of the ${values.name}! You hold in you're hands the power to make or break this club`,
                                            timestamp: dateString,
                                            dismissed: false,
                                            id: v4(),
                                          }
                                        ),
                                      });
                                    await db
                                      .collection('users')
                                      .doc(vicePres.uid)
                                      .update({
                                        activites: firebase.firestore.FieldValue.arrayUnion(
                                          {
                                            title: `You're now the Vice President of the ${values.name}!`,
                                            msg: `You're now the Vice President of the ${values.name}! You hold in you're hands the power to make or break this club`,
                                            timestamp: dateString,
                                            dismissed: false,
                                            id: v4(),
                                          }
                                        ),
                                      });
                                    await db
                                      .collection('users')
                                      .doc(edtr.uid)
                                      .update({
                                        activites: firebase.firestore.FieldValue.arrayUnion(
                                          {
                                            title: `You're now the Editor of the ${values.name}!`,
                                            msg: `You're now the Editor of the ${values.name}! You hold in you're hands the power to make or break this club`,
                                            timestamp: dateString,
                                            dismissed: false,
                                            id: v4(),
                                          }
                                        ),
                                      });

                                    history.push('/');
                                  });
                              }
                            });
                        }
                      });
                  }
                });
            }
          }}
        >
          {({ values, errors, handleSubmit, handleChange, isSubmitting }) => (
            <form
              autoComplete="false"
              onSubmit={handleSubmit}
              className="bg-white shadow-md rounded px-8 outline-none border-none py-4 pt-8"
            >
              <div className="px-4 pb-4">
                <TextField
                  id="name"
                  label="Name"
                  placeholder="Interact Club"
                  type="text"
                  value={values.name}
                  onChange={handleChange('name')}
                />
                <small className="text-red-500 pb-0">{errors.name}</small>
                <TextField
                  id="pName"
                  label="Presidents Email"
                  placeholder="manuga-123@stps.edu.lk"
                  type="text"
                  value={values.presidentEmail}
                  onChange={handleChange('presidentEmail')}
                />
                <small className="text-red-500 pb-0">
                  {errors.presidentEmail}
                </small>
                <TextField
                  id="vpEmail"
                  label="Vice Presidents Email"
                  placeholder="has-123@stps.edu.lk"
                  type="text"
                  value={values.vicePresident}
                  onChange={handleChange('vicePresident')}
                />
                <small className="text-red-500 pb-0">
                  {errors.presidentEmail}
                </small>
                <TextField
                  id="eEmail"
                  label="Editor Email"
                  placeholder="vivek-123@stps.edu.lk"
                  type="text"
                  value={values.editorEmail}
                  onChange={handleChange('editorEmail')}
                />
                <small className="text-red-500 pb-0">
                  {errors.editorEmail}
                </small>

                <div className="flex flex-col">
                  <label htmlFor="desc">Description (min: 50):</label>
                  <textarea
                    rows={5}
                    name="desc"
                    cols={50}
                    className="mx border border-blue-200 p-0.5"
                    value={values.description}
                    onChange={handleChange('description')}
                  ></textarea>
                  <small className="text-red-500 pb-0">
                    {errors.description}
                  </small>
                </div>

                <div className="p-1 5 m-1 5">
                  <label htmlFor="headerImg">Header Image: </label>
                  <input
                    ref={headerImgRef}
                    type="file"
                    name="headerImg"
                    accept="image/**"
                  />
                  <label htmlFor="image1">Image 1: </label>
                  <input
                    type="file"
                    ref={image1}
                    name="image1"
                    accept="image/**"
                  />
                  <label htmlFor="image2">Image 2: </label>
                  <input
                    type="file"
                    name="image2"
                    ref={image2}
                    accept="image/**"
                  />
                </div>

                <div className="flex flex-col items-start">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Create Club
                  </button>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterClub;
