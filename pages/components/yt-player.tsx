import Modal from "@material-ui/core/Modal";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { createContext, useContext, useState } from "react";
import YouTube from "react-youtube";

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

    const show = (text: string) => {
        setId(text);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const opts = {
        playerVars: {
            autoplay: 1 as const,
        },
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
                        onError={(event) => { console.log("onError") }}
                        onPause={(event) => { console.log("onPause") }}
                        onPlay={(event) => {
                            const cc=setInterval(() => {
                                console.log(event.target.getCurrentTime())
                            }, 100);
                            clearInterval(cc)
                        
                        }}
                        onReady={(event) => { console.log("onReady") }}
                        onEnd={(event) => { console.log("onEnd") }}
                        onStateChange={(event) => { console.log("onStateChange") }}
                        onPlaybackRateChange={(event) => { console.log("onPlaybackRateChange") }}
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