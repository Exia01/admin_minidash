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

const Login = () => {
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
              lg: 'calc(-125px + 100vh)',
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
                  <Typography variant='h4' component='h1'>
                    Login
                  </Typography>
                  <Link to='/register'>Don't Have an account?</Link>
                </Grid>
                {/* email */}
                <Grid xs={12}>
                  <FormControl fullWidth>
                    <Typography
                      variant='body1'
                      component='label'
                      marginBottom={1}
                    >
                      Email Address
                    </Typography>
                    <OutlinedInput
                      id='email'
                      defaultValue=''
                      size='small'
                      type='email'
                    />
                  </FormControl>
                </Grid>
                {/* password */}
                <Grid xs={12}>
                  <FormControl fullWidth>
                    <Typography
                      variant='body1'
                      component='label'
                      marginBottom={1}
                    >
                      Password
                    </Typography>
                    <OutlinedInput
                      id='password'
                      defaultValue=''
                      size='small'
                      type='password'
                    />
                  </FormControl>
                </Grid>
                {/* keep me signed ip check */}
                <Grid
                  xs={12}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox size='small' />}
                      label='Keep me signed in'
                    />
                  </FormGroup>
                  <a href='/'>Forgot Password?</a>
                </Grid>
                <Grid xs={12}>
                  <Button variant='contained' size='large' fullWidth>
                    Login
                  </Button>
                </Grid>
                {/* <Grid xs={12}>
                  <Divider>
                    <Typography component='span' variant='caption'>
                      Login with
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

export default Login;
