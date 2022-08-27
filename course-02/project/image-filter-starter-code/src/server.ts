import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles, isImageUrl, isUrl } from './util/util';
import { Request, Response } from "express"; 

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });
  
  app.get("/filteredimage", async (req: Request, res: Response) => {
    try {
      // get image url from request query 
      const { image_url } : { image_url:string } = req.query
      
      // validate the that the image url was passed in the request
      if (!image_url) return res.status(422).json({ error: "please pass an image url in query" })

      // Validate if it is a URL
      if (!isUrl(image_url)) return res.status(422).json({ error: "Invalid URL. Url must beging with http:// or https://" })
      
      // Validate if it is an Image URL
      if (!isImageUrl(image_url)) return res.status(422).json({error:"Invalid Image URL. Url must end with any of .jpg, .png, .jpeg, .png, .webp, .avif, .gif, .svg"})
      
      // filter image
      const filteredPath = await filterImageFromURL(image_url)

      // send the response & delete files on server
      return res.status(200).sendFile(filteredPath, async () => {
        await deleteLocalFiles([filteredPath])
      })
    } catch (error) {
      return res.status(500).json({error:"sorry, something is wrong with the sever"})
    }
  })
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();