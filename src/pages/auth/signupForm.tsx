import React, { useState } from 'react';
import CustomInput from '../../components/customInput';
import { Button } from '../../components/button';
import { validateField } from '../../utils/validation';
import { Eye, EyeOff } from 'lucide-react';
import { CustomRotatingLoader } from '../../components/loaders';

export interface ISignUpvalues {
  fullName: string;
  profession: string;
  email: string;
  password: string;
}

interface SignupFormProps {
  handleSignUpForm: (values: ISignUpvalues) => void;
  isLoading: boolean;
  error?: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ handleSignUpForm, isLoading, error }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [triggerSubmit, setTriggerSubmit] = useState<boolean>(false);

  const [formValues, setFormValues] = useState<ISignUpvalues>({
    email: '',
    password: '',
    fullName: '',
    profession: '',
  });

  const [errors, setErrors] = useState<ISignUpvalues>({
    email: '',
    password: '',
    fullName: '',
    profession: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });

    if (name === 'password') {
      setPassword(value);
    }

    if (triggerSubmit) {
      const error = validateField(name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setTriggerSubmit(true);
    event.preventDefault();

    const newErrors: ISignUpvalues = {
      email: '',
      password: '',
      fullName: '',
      profession: '',
    };

    Object.entries(formValues).forEach(([key, value]) => {
      const error = validateField(key, value as string);
      console.log(error, 'validateFielderror');
      if (error) {
        newErrors[key as keyof ISignUpvalues] = error;
      }
    });

    console.log(newErrors, 'newErrors');

    setErrors(newErrors);

    if (Object.keys(newErrors).every((key) => newErrors[key as keyof ISignUpvalues] === '')) {
      try {
        handleSignUpForm(formValues);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-1'>
      <div>
        <CustomInput
          label='Full Name'
          type='text'
          id='fullName'
          name='fullName'
          placeholder='Enter your full name'
          onChange={handleChange}
          error={errors.fullName}
        />
      </div>

      <div>
        <CustomInput
          label='Profession'
          type='text'
          id='profession'
          name='profession'
          placeholder='Enter your profession'
          onChange={handleChange}
          error={errors.profession}
        />
      </div>
      <div>
        <CustomInput
          label='Email'
          type='email'
          id='email'
          name='email'
          placeholder='Enter your email'
          onChange={handleChange}
          error={errors.email}
        />
      </div>
      <div className='relative'>
        <CustomInput
          label='Password'
          type={showPassword ? 'text' : 'password'}
          id='password'
          name='password'
          placeholder='Enter your password'
          onChange={handleChange}
          error={errors.password}
        />
        {password.length > 0 && (
          <span
            onClick={togglePasswordVisibility}
            className='absolute transform translate-y-3 cursor-pointer right-4 top-[calc(50%-18px)]'>
            {showPassword ? (
              <Eye className='size-5 text-greenT/70' />
            ) : (
              <EyeOff className='size-5 text-greenT/70' />
            )}
          </span>
        )}
      </div>
      <div className='ml-1'>
        <p className='text-sm text-red-500 '>{error}</p>
      </div>

      <div className=''>
        <Button
          type='submit'
          variant='accent'
          size='lg'
          className='relative w-full h-12 text-white'>
          Sign Up
          {isLoading && <CustomRotatingLoader className={'left-[calc(60%-0px)] right-0'} />}
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
