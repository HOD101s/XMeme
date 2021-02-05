import "./App.css";
import Header from "./components/layouts/Header";
import ImageGrid from "./components/layouts/ImageGrid";
import {
  Container,
  Typography,
  createMuiTheme,
  ThemeProvider,
  Grid,
  Button,
} from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#4E1",
    },
    secondary: {
      main: "#3F51B5",
    },
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Header />
        <Container maxWidth="lg">
          <Grid
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <Typography variant="h2">XMeme</Typography>
              <Typography variant="subtitle1">
                The Best Meme Directory
              </Typography>
            </Grid>
            <Grid item>
              <Button
                endIcon={<span class="material-icons">launch</span>}
                href="https://xmeme-manas-api.herokuapp.com/swagger-ui/"
                target="_blank"
                variant="contained"
                disableElevation
              >
                swagger_documentation
              </Button>
            </Grid>
          </Grid>
          <ImageGrid />
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
