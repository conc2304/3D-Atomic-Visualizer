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
import { PeriodicTableElement } from "../../types";

// type definition for Info Modal Props
type InfoModalProps = {
  onClose?: () => void;
  open: boolean;
  data: PeriodicTableElement;
};

// Info Modal Component
export const InfoModal = (props: InfoModalProps) => {
  const { onClose, open, data } = props;

  if (!data) return <></>;

  // we want to control the order of this data, the "rest" we dont care
  const {
    name,
    symbol,
    number,
    discovered_by,
    named_by,
    appearance,
    summary,
    ...rest // any props not named are stored in rest
  } = data;

  return (
    <Dialog
      onClose={() => onClose && onClose()}
      open={open}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "#000000BB",

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
            width: "450px",
            color: "cyan",
          }}
        >
          <DialogTitle sx={{ backgroundColor: "transparent" }}>
            <Box
              component={"div"}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "baseline",
              }}
            >
              <Typography
                variant="h3"
                sx={{ position: "absolute", top: -5, right: 0 }}
              >
                <strong>{number}</strong>
              </Typography>
              <Typography variant="h2" mr={3}>
                <strong>{symbol}</strong>
              </Typography>
              <Typography variant="h4">{name}</Typography>
            </Box>
          </DialogTitle>
          <Typography variant="body2" maxWidth={"350px"}>
            <strong>Named by:</strong> {named_by || "N/A"}
          </Typography>
          <Typography variant="body2" maxWidth={"350px"}>
            <strong>Discovered by:</strong> {discovered_by || "N/A"}
          </Typography>
          <br />

          {appearance && (
            <Typography variant="body1" maxWidth={"350px"}>
              <strong>Appearance: </strong>
              {appearance}
            </Typography>
          )}
          <br />

          <Typography
            variant="body2"
            maxWidth={"350px"}
            textAlign="justify"
            sx={{ margin: "auto" }}
          >
            {summary}
          </Typography>
          <Box
            component={"div"}
            sx={{ maxHeight: "450px", overflowY: "sroll" }}
          >
            <List sx={{ pt: 0 }}>
              {/* iterate over all of the "rest" of the key value pairs and render them as list items  */}
              {Object.entries(rest).map(([key, value]) => {
                // only render the items we want, and dont render if we dont have data to render
                if (!ElementInfoKeys.includes(key) || !key || !value)
                  return null;

                return (
                  <ListItem key={key}>
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
      </DialogContent>
    </Dialog>
  );
};
