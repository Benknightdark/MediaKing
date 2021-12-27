import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { useRouter } from "next/router";
import { useYoutubePlayer } from "./components/yt-player";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    // imageList: {
    //   width: 500,
    //   height: 450,
    // },
    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },
  }),
);
export default function Home() {
  const nWindow = global.window as any;
  const [data, setData] = useState([]);
  const classes = useStyles();
  const router = useRouter();
  const { openYoutubePlayer } = useYoutubePlayer();

  const getData = () => {
    nWindow.electron.ytHotFromClient.send();
    const handleYTHotFromServer = (event: any, dataFromServer: React.SetStateAction<never[]>) => {
      console.log(dataFromServer)
      setData(dataFromServer)
      nWindow.electron.ytHotFromClient.off();
    };
    nWindow.electron.ytHotFromClient.on(handleYTHotFromServer);
    return () => {
      nWindow.electron.ytHotFromClient.off();
    };
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    data.length > 0 && <div className={classes.root}>
      <ImageList>
        {data.map((item:any) => (
          <ImageListItem key={item.thumbnail}>
            <img src={item.thumbnail} alt={item.title} onClick={() => {
              openYoutubePlayer(item.videoId)

            }} />
            <ImageListItemBar
              title={item.title}
              subtitle={<span>{item.descriptionSnippet}</span>}
              actionIcon={
                <IconButton aria-label={`info about ${item.title}`} className={classes.icon}
                  onClick={() => {
                    router.push(`/youtube?videoId=${item.videoId}`)
                  }}
                >
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>

  );
}
