# Create .env file

You have to add the following enviroment variables:
`DATABASE_URL="your_mongodb_url_here"`
`API_PORT=3000`

# Run the project on local

To run the project, use this command:
`npm run dev` or `npm run start`
You will have the backend running in port 3000 (declared in .env)

# Create products

POST body must be something like this:

<!-- {
   "products": [
      {
         "id": 1,
         "texts": [
            "oven for your kitchen",
            "big oven for family"
         ],
         "views": [
            {
               "name": "oven",
               "content": "product content here"
            }
         ]
      }
   ]
} -->
