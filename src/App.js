import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";

let prev = ["fish"];

function App() {
  const [photo, setPhoto] = useState([]);
  const [modal, setModal] = useState({src: "" });
  const [click,setClick] = useState(false);
  const [search, setSearch] = useState({
    query: "",
    onfocus: false,
  });

  let query = search.query;
  let onfocus = search.onfocus;

  let { src }= modal

  const getSearchResults = async (query) => {
    await axios
      .get(
        `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=d86db60c806ce7e10c24b5f965253436&text=${query}&format=json&nojsoncallback=1`
      )
      .then((response) => {
        const photos = response.data.photos.photo;
        setPhoto(photos);
        if (!prev.includes(query)) {
          prev.push(query);
        }
      })
      .catch(() => console.log("SEARCH_FAILURE"));
  };

  useEffect(() => {
    console.log("render");
    axios
      .get(
        `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=d86db60c806ce7e10c24b5f965253436&format=json&nojsoncallback=1`
      )
      .then((response) => {
        const photos = response.data.photos.photo;
        // photos.filter(item => item.is)
        setPhoto(photos);
      })
      .catch((error) => {
        console.log("Error fetching and parsing data", error);
      });
  }, []);
  // console.log(photo);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(search.query);
    getSearchResults(search.query);
    setSearch({ ...search, query: "", onfocus: false });
  };

  const handleChange = (e) => {
    e.preventDefault();
    setSearch({ query: e.target.value, onfocus: false });
  };

  const handleFocus = (e) => {
    e.preventDefault();
    setSearch({ ...search, onfocus: true });
  };

  const handleSearchList = (e) => {
    e.preventDefault();
    getSearchResults(e.target.innerHTML);
    setSearch({ ...search, query: "", onfocus: false });
  };

  const handleClick = (e) => {
    setModal({ src: e.target.currentSrc });
   setClick(true);
  };

  return (
    <div className="App">
      <div className="search-container">
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            className="search-input"
            placeholder="Search"
            type="search"
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
          />
          {onfocus &&
            prev.map((item, indx) => {
              return (
                <ul
                  onClick={(e) => handleSearchList(e)}
                  className="search-items"
                  key={indx}
                >
                  {item}
                </ul>
              );
            })}
          <div className="btn-search">
            <button className="submit-btn" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="img-container">
        {photo &&
          photo.map((pic) => {
            return (
              <img
                style={{
                  width: "300px",
                  height: "300px",
                  padding: "20px",
                  cursor: "pointer",
                }}
                key={pic.id}
                alt={pic.title}
                src={`https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}.jpg`}
                onClick={(e) => handleClick(e)}
              />
            );
          })}
        { click && (
          <dialog style={{background:"transparent", border:"none"}}
            open>
            <div className="dialog" >
            <img onClick={() => setClick(false)} src={src} alt="modal-img" style={{cursor: "pointer"}}/>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
}

export default App;
