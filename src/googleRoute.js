import express from "express";
import googleapi from './googleapi.js'
const router = express.Router();

const API = `api`;


router.get(`/${API}/google/photos`, async(req, res) => {
  try{
    const {photoId} = req.query
    const photo = await googleapi.runPlacePhotos(photoId)
    res.send(photo)
  } catch(err) {
    console.log(err)
    res.json(err)
  }
})


router.get(`/${API}/google/details`, async(req, res) => {
  try{
    const {placeIds} = req.query
    const places = placeIds.split(',')

    const getDetails = async() => {
      let details = []
      let count = 0 
      while ( count < places.length ) {
        const detail = await googleapi.runPlaceDetails(places[count])
        details.push(detail)
        count++
      }
      return details
    }

    const details = await getDetails()
      
    const getPhotos = async() => {
      let photos = []
      let count = 0 
      while (count < details.length) {
        let photos2 = []
        let count2 = 0
        while (count2 < details[count].photos.length && count2 < 3) {
          const photoReference = details[count].photos[count2].photo_reference
          const photo = await googleapi.runPlacePhotos(photoReference)
          photos2.push(photo)
          count2++
        }
        photos.push(photos2)
        count++
      }
      return photos
    }

    const photos = await getPhotos()

    res.json([details, photos])
  }catch(err){
    console.log(err.description)
    res.json(err)
  }
});

export default router;
