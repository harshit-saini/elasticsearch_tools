import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";

import { setStateValue } from "../store/app";
import { useDispatch } from "react-redux";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

const Listing = ({ items }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentIndexInLocalStorage, setcurrentIndexInLocalStorage] =
    useLocalStorage("currentIndex", "");
  const handleListItemClick = (item) => {
    console.log({ key: "currentIndex", value: item });
    dispatch(setStateValue({ key: "currentIndex", value: item }));
    setcurrentIndexInLocalStorage(item);
    navigate(`/${item}`);
  };
  return (
    <div>
      <List>
        {items.map((item, index) => (
          <ListItem key={index} onClick={() => handleListItemClick(item)}>
            <ListItemButton>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Listing;
