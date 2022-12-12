import {useEffect, useState} from 'react';
import './App.scss';
import Species from './Species';

const API_URL = 'https://swapi.dev/api/films/2/';
const SPECIES_IMAGES = {
  droid:
    'https://static.wikia.nocookie.net/starwars/images/f/fb/Droid_Trio_TLJ_alt.png',
  human:
    'https://static.wikia.nocookie.net/starwars/images/3/3f/HumansInTheResistance-TROS.jpg',
  trandoshan:
    'https://static.wikia.nocookie.net/starwars/images/7/72/Bossk_full_body.png',
  wookie:
    'https://static.wikia.nocookie.net/starwars/images/1/1e/Chewbacca-Fathead.png',
  yoda: 'https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png',
};

//Map to assign the images using species name from the `SPECIES_IMAGES` object
const namesMap = {
  Droid: 'droid',
  Human: 'human',
  Wookie: 'wookie',
  Trandoshan: 'trandoshan',
  "Yoda's species": 'yoda',
};
const CM_TO_IN_CONVERSION_RATIO = 2.54;
//Function to convert cm to in and display acordingly
const cm_to_in = cm =>
  isNaN(cm) ? 'N/A' : Math.ceil(cm / CM_TO_IN_CONVERSION_RATIO) + '"';

function App() {
  //State for films species
  const [species, setSpecies] = useState([]);
  //Function to get all species from given API URL
  const getAllSpecies = () => {
    //Fetch the species urls from the API
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        //Fetch every species url and save the data on state
        Promise.all(
          data.species.map(url => fetch(url).then(res => res.json()))
        ).then(data => {
          setSpecies(data);
        });
      })
      .catch(error => console.error('API Error:', error));
  };
  //Function to clear all species on cleanup
  const clearAllSpecies = () => {
    setSpecies([]);
  };
  //Get all species on first render
  useEffect(() => {
    getAllSpecies();
    return () => {
      clearAllSpecies();
    };
  }, []);
  return (
    <div className="App">
      <h1>Empire Strikes Back - Species Listing</h1>
      <div className="App-species">
        {species.map((sp, index) => {
          return (
            <div className="species-wrapper" key={index}>
              {Species({
                ...sp,
                image: SPECIES_IMAGES[namesMap[sp.name]],
                height: cm_to_in(sp.average_height),
                numFilms: sp.films.length,
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
