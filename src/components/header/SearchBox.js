import React, { useContext, useState, useEffect } from "react";
import {
  InputBase,
  IconButton,
  Popper,
  CircularProgress,
  Grid
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";

import { GlobalContext } from "../GlobalState";
import suggestSearch from "../../apis/suggestSearch";
import AutoSearchResult from "./AutoSearchResult";

import youtubeSearch from "../../apis/youtubeSearch";



const SearchBox = () => {
 const { setSearchResult } = useContext(GlobalContext);
 const { searchState, setSearchState } = useContext(GlobalContext);

 const [searchQuery, setSearchQuery] = useState("");
 const [autoSearchData, setAutoSearch] = useState("");
 const [ytSearchQuery, setYtSearchQuery] = useState(null);
 
   // toggle popper
   const [isPopperOpen, setPopper] = useState(true);


  // get back the selected search data
  const onSearchSelect = result => {
    setSearchQuery(result);
    setYtSearchQuery(result);
    setSearchState("searching");  
    
  };

  const userSearched = () => {
    // here we are changing the state of ytSearchQuery
    // and we will useEffect to detect change on it and make api request
    setYtSearchQuery(searchQuery);

       // also make the search state to be searching
     };
  // for controlled input change
  const onChange = e => {
    setSearchQuery(e.target.value);

    getAutocomplete();
  };

  // get autocomplete data form api

  const getAutocomplete = async () => {
    const response = await suggestSearch.get("", {
      params: {
        q: searchQuery
      }
    });
    setAutoSearch(response.data[1]);
  };

  // when user hits enter then also fetch the data from yt api

  const onSearchSubmit = e => {
    e.preventDefault();
    setSearchState("searching");
    setYtSearchQuery(searchQuery);
  };

  // get youtube search result from api
  useEffect(() => {
    const searchYt = async data => {
      const res = await youtubeSearch.get("/search", {
        params: { q: data }
      });
      setSearchResult(res.data.items);
      setSearchState("completed");
    };
    // only search if there is any value
    if (ytSearchQuery && ytSearchQuery !== "") {
      searchYt(ytSearchQuery);
    }
    console.log(ytSearchQuery);
  }, [ytSearchQuery]);

  // show loading icon while we fetch the results from api

  const popperResult = () => {
    switch (searchState) {
      case "searching":
      return (
        <Grid
        style={{ height: "100vh" }}
        container
        justify="center"
        alignItems="center"
        >
        <CircularProgress />
        </Grid>
        );
        case "clicked":
        return (
        <AutoSearchResult
        results={autoSearchData}
        onSearchSelect={onSearchSelect}
        />
        );
        case "completed":
        setPopper(false);
        break;
        default:
        break;
      }
      console.log("Function ran");
    };

    return (
    <>
    <IconButton
    onClick={() => setSearchState("home")}
    color="inherit"
    aria-label="Menu"
    >
    <ArrowBack />
    </IconButton>
    <form style={{ width: "100%" }} onSubmit={e => onSearchSubmit(e)}>
    <InputBase
    fullWidth
    placeholder="Search..."
    autoFocus
    style={{ color: "#fff", paddingLeft: "16px" }}
    value={searchQuery}
    onChange={onChange}
    // on click we will show popper
    onClick={() => {
      setSearchState("clicked");
      setPopper(true);
    }}
    />
    </form>
    <Popper
    style={{ width: "100%", height: "100%", background: "#fff" }}
    open={isPopperOpen}
    anchorEl={document.getElementById("navbar")}
    placement="bottom"
    >
    {popperResult}
    </Popper>
    </>
    );
  };

  export default SearchBox;