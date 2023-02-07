import { Link } from 'react-router-dom';
import './App.css';

//MUI
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

function App() {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <div className='App'>
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <Item>md=6</Item>
        </Grid>
        <Grid xs={12} md={6}>
          <Typography variant='body2' component='p'>
            <Item>md=6</Item>
          </Typography>
        </Grid>
        <Grid xs={12} md={6}>
          <Typography variant='body2' component='p'>
            <Button
              component={Link}
              to='/login'
              variant='contained'
              color='primary'
            >
              Go to login page
            </Button>
          </Typography>
        </Grid>
        <Grid xs={12} md={6}>
          <Typography variant='body2' component='p'>
            <Button
              component={Link}
              to='/register'
              variant='contained'
              color='primary'
            >
              Go to register page
            </Button>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
