import { Link } from 'react-router-dom';

// MUI imports
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { Divider } from '@mui/material';
// logo import
import logo from '../../../src/assets/logos/logo.png';

const Register = () => {
  return (
    <Grid
      container
      sx={{
        minHeight: '100vh',
        width: '100%',
        alignItems: 'flex-start',
        bgcolor: 'background.default',
      }}
    >
      <Grid
        xs={12}
        md={12}
        paddingTop={4}
        paddingX={3}
        // sx={{ height: '120px' }}
      >
        <Link to='/'>
          <Box
            component='img'
            sx={{
              maxWidth: { xs: 70, md: 70 },
            }}
            alt='Website Logo'
            src={logo}
          />
        </Link>
      </Grid>
      <Grid container xs={12}>
        <Grid
          xs={12}
          // md={}
          // sx={{
          //   maxWidth: '495px',
          //   // padding: 3,
          // }}
          sx={{
            minHeight: {
              xs: 'calc(-210px + 100vh)',
              md: 'calc(-110px + 100vh)',
              lg: 'calc(-112px + 100vh)',
            },
            alignItems: 'center',
            justifyContent: 'center',
          }}
          container
        >
          <Card sx={{ padding: '0rem', maxWidth: '495px' }}>
            <CardContent>
              <Grid container spacing={3} padding={3}>
                <Grid
                  xs={12}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <Typography variant='h5' component='h1' fontWeight='600'>
                    Sign up
                  </Typography>
                  <Link to='/login'>Already have an account?</Link>
                </Grid>
                {/* First Name */}
                <Grid xs={12} lg={6}>
                  <FormControl fullWidth>
                    <Typography
                      variant='body2'
                      component='label'
                      marginBottom={1}
                    >
                      First Name*
                    </Typography>
                    <OutlinedInput
                      id='first'
                      defaultValue=''
                      size='small'
                      type='text'
                    />
                  </FormControl>
                </Grid>
                {/* Last Name */}
                <Grid xs={12} lg={6}>
                  <FormControl fullWidth>
                    <Typography
                      variant='body2'
                      component='label'
                      marginBottom={1}
                    >
                      Last Name*
                    </Typography>
                    <OutlinedInput
                      id='first'
                      defaultValue=''
                      size='small'
                      type='text'
                    />
                  </FormControl>
                </Grid>
                {/* ShopId */}
                <Grid xs={12}>
                  <FormControl fullWidth>
                    <Typography
                      variant='body2'
                      component='label'
                      marginBottom={1}
                    >
                      Shop Number
                    </Typography>
                    <OutlinedInput
                      id='shopNumber'
                      defaultValue=''
                      size='small'
                      type='text'
                    />
                  </FormControl>
                </Grid>
                {/* Email */}
                <Grid xs={12}>
                  <FormControl fullWidth>
                    <Typography
                      variant='body2'
                      component='label'
                      marginBottom={1}
                    >
                      Email Address*
                    </Typography>
                    <OutlinedInput
                      id='email'
                      defaultValue=''
                      size='small'
                      type='email'
                    />
                  </FormControl>
                </Grid>
                {/* Password*/}
                <Grid xs={12}>
                  <FormControl fullWidth>
                    <Typography
                      variant='body2'
                      component='label'
                      marginBottom={1}
                    >
                      Password*
                    </Typography>
                    <OutlinedInput
                      id='email'
                      defaultValue=''
                      size='small'
                      type='email'
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12}>
                  <Typography variant='caption' component='p'>
                    By Signing up, you agree to our
                    <Typography
                      variant='caption'
                      component='a'
                      href='/'
                      target='_blank'
                      rel='noopener'
                      marginX={1}
                    >
                      Terms of Service
                    </Typography>
                    and
                    <Typography
                      variant='caption'
                      component='a'
                      href='/'
                      target='_blank'
                      rel='noopener'
                      marginX={1}
                    >
                      Privacy Policy
                    </Typography>
                  </Typography>
                </Grid>
                <Grid xs={12}>
                  <Button variant='contained' size='large' fullWidth>
                    Create Account
                  </Button>
                </Grid>
                {/* <Grid xs={12}>
                  <Divider>
                    <Typography component='span' variant='caption'>
                      Sign up with 
                    </Typography>
                  </Divider>
                </Grid> */}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Register;
