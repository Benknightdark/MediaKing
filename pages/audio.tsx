import React, { useEffect, useState } from "react";
import { DropzoneArea } from "material-ui-dropzone";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DoneIcon from "@material-ui/icons/Done";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    btnMargin: {
      margin: theme.spacing(1),
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  })
);

export default function Audio() {
  const classes = useStyles();
  const nWindow = global.window as any;
  const initArray = [];
  const [files, setFiles] = useState(initArray);
  const handleChange = (file) => {
    setFiles(
      file.map((a) => {
        return { name: a.name, path: a.path, status: "" };
      })
    );
    console.log(files);
  };

  useEffect(() => {
    const handleAudioConvertFromServer = async (event, data) => {
      let newFiles = files.filter((a) => a.path != data.path);
      console.log(newFiles);
      newFiles = [...newFiles, data];
      await setFiles([]);
      await setFiles(newFiles);
    };

    nWindow.electron.audioConvertFromServer.on(handleAudioConvertFromServer);
    return () => {
      nWindow.electron.audioConvertFromServer.off();
    };
  }, [files]);
  return (
    <div>
      <DropzoneArea
        onChange={handleChange}
        filesLimit={50}
        showPreviewsInDropzone={false}
        maxFileSize={30000000000}
        dropzoneText={"拖曳你要轉換的音樂檔到此處"}
      />
      <Box p={2}>
        <Divider />
      </Box>

      <Button
        className={classes.btnMargin}
        variant="contained"
        color="primary"
        onClick={async () => {
          if (files.length === 0) {
            alert("沒有任何檔案");
            return;
          }
          const newFiles = files.filter((a) => a.status == "");
          if (newFiles.length === 0) {
            alert("所有檔案都已完成轉換");
            return;
          }
          for (let index = 0; index < newFiles.length; index++) {
            const element = newFiles[index];
            element.status = "converting";
          }
          await setFiles([]);
          await setFiles(newFiles);
          nWindow.electron.audioConvertFromClient.send(files);
        }}
      >
        開始轉換
      </Button>
      <Button
        className={classes.btnMargin}
        variant="contained"
        color="secondary"
        onClick={async () => {
          await setFiles([]);
        }}
      >
        清除全部
      </Button>

      <Button
        className={classes.btnMargin}
        variant="contained"
        color="default"
        onClick={async () => {
          nWindow.electron.openAudioConvertFolderFromClient.send();
        }}
      >
        開啟轉檔資料夾
      </Button>
      <Box p={1}></Box>
      {files.length > 0 && (
        <Accordion defaultExpanded>
          <AccordionSummary className="gradient-green"
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>檔案列表</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List className={classes.root}>
              {files.map((a, index) => {
                return (
                  <div>
                    <ListItem key={index} className="gradient-blue">
                      {a?.status === "converting" && <CircularProgress />}
                      {a?.status === "done" && (
                        <ListItemIcon>
                          <DoneIcon />
                        </ListItemIcon>
                      )}
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="start"
                          aria-label="delete"
                          onClick={async () => {
                            const newFiles = files.filter((f) => f !== a);
                            await setFiles(newFiles);
                          }}
                        >
                          <HighlightOffIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                      <ListItemText primary={a.name} />
                    </ListItem>
                   <Box p={2}>
                   </Box>
                  </div>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  );
}
