import React, { useEffect } from 'react';
import TextField from '../components/TextField';
import { Link, useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { auth } from '../firebase';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .matches(/^[\w-.]+@stps.edu.lk$/, 'Email needs to contain stps')
    .required('Required'),
  password: Yup.string().required('Required'),
});

const Login = () => {
  const history = useHistory();

  useEffect(() => {
    document.title = 'Login';

    setTimeout(() => {
      if (auth.currentUser) {
        history.replace('/');
      }
    }, 1000);
  }, [history]);

  return (
    <div className="h-screen w-full flex justify-center items-center bg-blue-400">
      <div className="w-full max-w-md bg-gray-800">
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {
            try {
              await auth.signInWithEmailAndPassword(
                values.email,
                values.password
              );
              history.replace('/');
            } catch (err) {
              if (err.code === 'auth/wrong-password') {
                setErrors({ password: err.message });
              }
            }
          }}
          validationSchema={LoginSchema}
        >
          {({ values, errors, handleSubmit, handleChange }) => (
            <form
              autoComplete="false"
              onSubmit={handleSubmit}
              className="bg-white shadow-md rounded px-8 outline-none border-none py-8 pt-8"
            >
              <div className="px-4 pb-4">
                <TextField
                  id="email"
                  label="Email"
                  placeholder="manuga-1234@stps.edu.lk"
                  type="text"
                  value={values.email}
                  onChange={handleChange('email')}
                />
                <small className="text-red-500 pb-0">{errors.email}</small>

                <TextField
                  id="password"
                  label="Password"
                  placeholder="Password"
                  type="password"
                  value={values.password}
                  onChange={handleChange('password')}
                />
                <small className="text-red-500 pb-0">{errors.password}</small>

                <div className="flex flex-col items-start">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Login
                  </button>
                  <small>
                    Don't have an account? <Link to="/register">Register</Link>{' '}
                    here
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

export default Login;
