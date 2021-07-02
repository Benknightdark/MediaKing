import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React, { useEffect, useState } from "react";
import Divider from "@material-ui/core/Divider";
import GetAppIcon from '@material-ui/icons/GetApp';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Typography from '@material-ui/core/Typography';
import LinearProgress, { LinearProgressProps } from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
      // width: "100%",
      // height: "auto"
    },
  })
);
function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${props.value}%`}</Typography>
      </Box>
    </Box>
  );
}
export default function Youtube() {
  const nWindow = global.window as any;
  const [data, setData] = useState({} as any);
  const [sourceUrl, setSourceUrl] = useState('');
  const [progress, setProgress] = React.useState(0);
  const classes = useStyles();

  useEffect(() => {
    const handleYTInfoFromServer = (event, dataFromServer) => {
      console.log(dataFromServer);
      setData(dataFromServer);
    };
    const handleYTDownloadFromServer = (event, progress, videoLength) => {
      console.log(progress)
      console.log(videoLength)
      if (progress.percent!==undefined){
        setProgress(progress.percent);
      }else{
        const hms = progress?.timemark;   
        const a = hms.split(':'); 
        const seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
        console.log(seconds);
        const percent=(seconds/videoLength)*100
        setProgress(percent);
      }  
    };
    nWindow.electron.ytInfoFromServer.on(handleYTInfoFromServer);
    nWindow.electron.ytDownloadFromServer.on(handleYTDownloadFromServer)
    return () => {
      nWindow.electron.ytInfoFromServer.off();
      nWindow.electron.ytDownloadFromServer.off();
    };
  }, []);
  return (
    <div style={{ width: '100%' }}>
    <Box display="flex" p={1} bgcolor="background.paper">
    <div className={classes.root}>
      <TextField
        id="filled-full-width"
        label="Youtube影片連結"
        style={{ margin: 8 }}
        helperText="輸入Youtube影片連結"
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        variant="filled"
        onChange={(e) => {
          nWindow.electron.ytInfoFromClient.send(e.target.value);
          setSourceUrl(e.target.value);
          setProgress(0);
        }}
      />
      <LinearProgressWithLabel value={progress} />

      {data?.videoDetails?.author && (
        <div>
          <Grid container spacing={3}>
            <Grid item md={12} lg={6}>
              <Paper className={classes.paper}>
                <List className={classes.root}>
                  <ListItem>
                    <ListItemText
                      primary="名稱"
                      secondary={data?.videoDetails?.title}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="作者"
                      secondary={data?.videoDetails?.author}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary={
                        <img style={{
                          width: "100%",
                          height: "auto"
                        }}
                          src={
                            data?.videoDetails?.thumbnail.thumbnails[
                            data?.videoDetails?.thumbnail.thumbnails.length - 1
                            ]["url"]
                          }
                        />
                      }
                    />
                  </ListItem>
                  <Divider />


                  <ListItem>
                    <ListItemText
                      primary="關鍵字"
                      secondary={data?.videoDetails?.keywords?.join(",")}
                    />
                  </ListItem>
                  <Divider />

                  <ListItem>
                    <ListItemText
                      primary="平均評分"
                      secondary={data?.videoDetails?.averageRating}
                    />
                  </ListItem>
                  <Divider />

                  <ListItem>
                    <ListItemText
                      primary="關看人數"
                      secondary={data?.videoDetails?.viewCount}
                    />
                  </ListItem>
                  <Divider />

                  <ListItem>
                    <ListItemText
                      primary="影片時間"
                      secondary={new Date(
                        data?.videoDetails?.lengthSeconds * 1000
                      )
                        .toISOString()
                        .substr(11, 8)}
                    />
                  </ListItem>
                  <Divider />

                  <ListItem>
                    <ListItemText
                      primary="描述"
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                            style={{
                              display: 'inline',
                              overflowWrap: 'break-word'
                            }}
                          >
                            {data?.videoDetails?.shortDescription
                            }
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item md={12} lg={6}>
              <Paper className={classes.paper}>
                <List>
                  {
                    data?.streamingData?.adaptiveFormats.map(a => {
                      return (<div>
                        <ListItem alignItems="flex-start" key={a.itag}>
                          <ListItemText
                           style={{
                            display: 'inline',
                            overflowWrap: 'break-word'
                          }}
                            primary={`${a.qualityLabel} - ${a.quality} - ${a.mimeType}`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" onClick={
                              () => {
                                const dataType = a.mimeType.indexOf('video') != -1 ? 'video' : 'audio'
                                nWindow.electron.ytDownloadFromClient.send(a.url, dataType, sourceUrl,
                                  data?.videoDetails?.lengthSeconds);
                              }
                            }>
                              <GetAppIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider></Divider>
                      </div>)
                    })
                  }
                </List>
              </Paper>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
        
    </Box>
  </div>
  );
}
