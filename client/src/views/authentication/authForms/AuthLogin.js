import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../store/auth/authSlice';

import CustomCheckbox from '../../../components/forms/theme-elements/CustomCheckbox';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';

import AuthSocialButtons from './AuthSocialButtons';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [remember, setRemember] = useState(true);

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("data : ", { email, password });
    const res = await dispatch(login({ email, password, remember }));
    if (res.type.endsWith('fulfilled')) {
      navigate('/');
    }
  };

  return (
  <>
    {title ? (
      <Typography fontWeight="700" variant="h3" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}

    {/* <AuthSocialButtons title="Sign in with" />
    <Box mt={3}>
      <Divider>
        <Typography
          component="span"
          color="textSecondary"
          variant="h6"
          fontWeight="400"
          position="relative"
          px={2}
        >
          or sign in with
        </Typography>
      </Divider>
    </Box> */}

    <Stack component="form" onSubmit={onSubmit}>
      <Box>
        <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
        <CustomTextField id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} variant="outlined" fullWidth required />
      </Box>
      <Box>
        <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
        <CustomTextField id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} variant="outlined" fullWidth required />
      </Box>
      <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
        <FormGroup>
          <FormControlLabel
            control={<CustomCheckbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
            label="Remember this device"
          />
        </FormGroup>
        {/* <Typography
          component={Link}
          to="/auth/forgot-password"
          fontWeight="500"
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
          }}
        >
          Forgot Password ?
        </Typography> */}
      </Stack>
      {error ? (
        <Typography color="error" variant="body2" mb={1}>{error}</Typography>
      ) : null}
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </Box>
    </Stack>
    {/* {subtitle} */}
  </>
);
};

export default AuthLogin;
