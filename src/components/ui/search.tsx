import { Autocomplete, InputAdornment, TextField, Box } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { PeriodicTableElement } from "../../types";

type SearchProps = {
  options: PeriodicTableElement[];
  onSearchChange?: (elementId: number | null) => void;
};

export const Search = (props: SearchProps) => {
  const { options, onSearchChange } = props;

  return (
    <>
      <Box
        component="div"
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "#FFFFFFAA",
          filter: "blur(4px)",
          zIndex: 0,
        }}
      ></Box>
      <Autocomplete
        options={options}
        sx={{ width: 300, zIndex: 10 }}
        getOptionLabel={(option) => option.name}
        onChange={(_, value) => {
          // will return null for removing filter
          // on remove, just keep the current filter
          onSearchChange && onSearchChange(value ? value?.number - 1 : null);
        }}
        renderInput={(props) => {
          const { InputProps, ...restProps } = props;
          return (
            <TextField
              variant="outlined"
              InputProps={{
                ...InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon htmlColor="#000" />
                  </InputAdornment>
                ),
              }}
              {...restProps}
              label="Search for Element"
            />
          );
        }}
      />
    </>
  );
};
