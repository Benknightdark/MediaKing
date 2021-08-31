import Modal from "@material-ui/core/Modal";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { createContext, useContext, useState } from "react";
import YouTube, { Options } from "react-youtube";

type YoutubePlayerContextActions = {
    openYoutubePlayer: (id: string) => void;
};

const YoutubePlayerContext = createContext({ } as YoutubePlayerContextActions);
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }),
);
export default function YoutubePlayerProvider({
    children,
}) {
    const [open, setOpen] = useState<boolean>(false);
    const [id, setId] = useState<string>("");
    const classes = useStyles();
    const [videoList, setVideoList] = useState({ });
    const [opts, setOpts] = useState<Options>({ });

    const show = (text: string) => {
        setId(text);
        setOpts({
            playerVars: {
                autoplay: 1 as const,
                origin: '*',
                start: Number.parseInt(videoList[text])
            },
        })
        setTimeout(() => {
            setOpen(true);
        }, 500);
    };

    const handleClose = () => {
        try {
            document.getElementsByTagName('iframe')[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
            setTimeout(() => {
                setOpen(false);
            }, 500);
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <YoutubePlayerContext.Provider value={{ openYoutubePlayer: show }}>
            <Modal
                className={classes.modal}
                open={open}
                onClose={handleClose}
            >
                <div className={classes.paper}>
                    <YouTube
                        videoId={id}
                        id={id}
                        opts={opts}
                        onError={(event) => { }}
                        onPause={(event) => {
                            setVideoList((prevState) => ({
                                ...prevState,
                                [id]: event.target.getCurrentTime()
                            }))
                        }}
                        onPlay={(event) => { }}
                        onReady={(event) => { }}
                        onStateChange={(event) => {
                            // 判斷影片是否播放完畢，如果已播放完畢，則將該影片的開始時間設為0
                            if (event.data === 0) {
                                setVideoList((prevState) => ({
                                    ...prevState,
                                    [id]: 0
                                }))
                            }
                        }}
                        onPlaybackRateChange={(event) => { }}
                    />
                </div>
            </Modal>
            {children}
        </YoutubePlayerContext.Provider>
    );
}

export const useYoutubePlayer = (): YoutubePlayerContextActions => {
    const context = useContext(YoutubePlayerContext);
    if (!context) {
        throw new Error("useSnackBar must be used within an SnackBarProvider");
    }
    return context;
};