import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Images(query, pageNumber) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [photos, setPhoto] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)

    axios
      .get(
        `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=d86db60c806ce7e10c24b5f965253436&format=json&nojsoncallback=1`
      )
      .then((response) => {
        const photos = response.data.photos.photo;
        setPhoto(photos);
        setHasMore(response.data.photos.photo.length > 0)
        setLoading(false)
      })
      .catch((error) => {
        console.log("Error fetching and parsing data", error);
      });
  }, []);

  
  return { loading, error, photos, hasMore }
}