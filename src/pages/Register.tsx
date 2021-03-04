import React, { useEffect, useState } from 'react';
import TextField from '../components/TextField';
import { Link, useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { auth, db } from '../firebase';
import * as Yup from 'yup';
import firebase from 'firebase';

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(4, 'Needs more than 4 letters')
    .max(20, "Can't be over 20 letters long")
    .required('Required'),
  lastName: Yup.string()
    .min(4, 'Needs more than 4 letters')
    .max(20, "Can't be over 20 letters long")
    .required('Required'),
  email: Yup.string()
    .email('Email format incorrect')
    .matches(
      /^[\w-.]+@stps.edu.lk$/,
      'Only Students of STPS can register here!'
    )
    .required('This is required'),
  parentEmail: Yup.string().email('Incorrect email format'),
  phone: Yup.string()
    .min(10, 'Phone number needs to be more than 10 digits')
    .max(10, 'Phone number too long')
    .required('This is a required field'),
  password: Yup.string()
    .min(8, 'Must me atleast 8 characters long')
    .required('Required'),
});

const Register = () => {
  const history = useHistory();
  const [grade, setGrade] = useState<string>('Grade 1');

  useEffect(() => {
    document.title = 'Register';
    setTimeout(() => {
      if (auth.currentUser) {
        history.replace('/');
      }
    }, 1000);
  }, [history]);

  return (
    <div className="h-screen w-full flex justify-center items-center bg-gray-800">
      <div className="w-full max-w-md bg-gray-800">
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: '',
            parentEmail: '',
          }}
          validationSchema={RegisterSchema}
          onSubmit={async values => {
            // console.log('tests');

            try {
              const usr: firebase.auth.UserCredential = await auth.createUserWithEmailAndPassword(
                values.email,
                values.password
              );

              const userId = usr.user?.uid;
              await db.collection('users').doc(userId).set({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phone: values.phone,
                parentEmail: values.parentEmail,
                uid: userId,
                level: 'member',
              });

              history.replace('/');
            } catch (err) {
              console.log(err);
            }
          }}
        >
          {({ values, handleChange, handleSubmit, errors }) => (
            <form
              onSubmit={handleSubmit}
              autoComplete="false"
              className="bg-white shadow-md rounded px-8 outline-none border-none py-8 pt-8"
            >
              <div className="px-4 pb-4">
                <TextField
                  id="firstName"
                  label="First Name"
                  placeholder="Manuga"
                  type="text"
                  value={values.firstName}
                  onChange={handleChange('firstName')}
                />
                <small className="text-red-500 pb-0">{errors.firstName}</small>

                <TextField
                  id="lastName"
                  value={values.lastName}
                  onChange={handleChange('lastName')}
                  label="Last Name"
                  placeholder="Jayarathne"
                  type="text"
                />
                <small className="text-red-500">{errors.lastName}</small>
                {/* This is the dropdown to select the grade */}
                <div className="flex px-5 pb-5 font-bold">
                  <label htmlFor="grade">Grade: </label>
                  <select
                    value={grade}
                    onChange={e => {
                      setGrade(e.target.value);
                    }}
                    className="flex self-center outline-none"
                    name="grade"
                  >
                    <option label="Grade 1" value="Grade 1" />
                    <option label="Grade 2" value="Grade 2" />
                    <option label="Grade 3" value="Grade 3" />
                    <option label="Grade 4" value="Grade 4" />
                    <option label="Grade 5" value="Grade 5" />
                    <option label="Grade 6" value="Grade 6" />
                    <option label="Grade 7" value="Grade 7" />
                    <option label="Grade 8" value="Grade 8" />
                    <option label="Grade 9" value="Grade 9" />
                    <option label="Grade 10" value="Grade 10" />
                    <option label="Grade 11" value="Grade 11" />
                  </select>
                </div>
                <TextField
                  id="phone"
                  value={values.phone}
                  onChange={handleChange('phone')}
                  label="Phone Number (WhatsApp)"
                  placeholder="xxx-xxx-xxxx"
                  type="text"
                />
                <small className="text-red-500">{errors.phone}</small>
                <TextField
                  id="email"
                  label="Email"
                  placeholder="manuga-1234@stps.edu.lk"
                  value={values.email}
                  type="text"
                  onChange={handleChange('email')}
                />
                <small className="text-red-500">{errors.email}</small>
                <TextField
                  id="password"
                  label="Password"
                  placeholder="Password"
                  type="password"
                  value={values.password}
                  onChange={handleChange('password')}
                />
                <small className="text-red-500">{errors.password}</small>
                <TextField
                  id="parentEmail"
                  label="Parent Email"
                  placeholder="parent@domain.com"
                  type="text"
                  value={values.parentEmail}
                  onChange={handleChange('parentEmail')}
                />
                <small className="text-red-500">{errors.parentEmail}</small>
                <div className="flex flex-col items-start">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Register
                  </button>
                  <small>
                    Already have an account? <Link to="/login">Login</Link> here
                  </small>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
