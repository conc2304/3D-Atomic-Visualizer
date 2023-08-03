import {
  Box,
  capitalize,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { ElementInfoKeys } from "../../constants";
import { PeriodicTableElement } from "../atom/types";

type InfoModalProps = {
  onClose?: () => void;
  open: boolean;
  data: PeriodicTableElement;
};

export const InfoModal = (props: InfoModalProps) => {
  const { onClose, open, data } = props;

  if (!data) return <></>;

  // we want to control the order of this data, the "rest" we dont care
  const {
    name,
    symbol,
    number,
    // category,
    discovered_by,
    named_by,
    appearance,
    summary,
    ...rest
  } = data;

  return (
    <Dialog
      onClose={() => onClose && onClose()}
      open={open}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "transparent",
          borderRadius: "16px",
          border: "2px solid cyan",
        },
      }}
    >
      <DialogContent>
        <Box
          component={"div"}
          sx={{
            position: "relative",
            zIndex: 10,
            // minWidth: "350px",
            width: "40vw",
            color: "cyan",
          }}
        >
          <DialogTitle sx={{ backgroundColor: "transparent" }}>
            <Box
              component={"div"}
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "baseline",
              }}
            >
              <Typography variant="h2">
                <strong>{symbol}</strong>
              </Typography>
              <Typography variant="h4">{name}</Typography>
            </Box>
          </DialogTitle>
          <Typography variant="body2" maxWidth={"350px"}>
            <strong>Named by:</strong> {named_by}
          </Typography>
          <Typography variant="body2" maxWidth={"350px"}>
            <strong>Discovered by:</strong> {discovered_by}
          </Typography>
          <br />

          <Typography variant="body1" maxWidth={"350px"}>
            <strong>Element Type: </strong>
            {appearance}
          </Typography>
          <br />

          <Typography
            variant="body2"
            maxWidth={"350px"}
            textAlign="center"
            sx={{ margin: "auto" }}
          >
            {summary}
          </Typography>
          <Box
            component={"div"}
            sx={{ maxHeight: "450px", overflowY: "sroll" }}
          >
            <List sx={{ pt: 0 }}>
              {Object.entries({ ...rest }).map(([key, value]) => {
                if (!ElementInfoKeys.includes(key)) return <></>;

                return (
                  <ListItem>
                    <Box
                      component={"div"}
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}
                    >
                      <Typography variant="h6">
                        {capitalize(key.replace("_", " "))}
                      </Typography>
                      <Typography variant="body1">
                        {value.toString()}
                      </Typography>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Box>
        <Box
          component={"div"}
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#000000AA",
            // filter: "blur(10px)",
            zIndex: 0,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
